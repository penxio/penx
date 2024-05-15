#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod hello;

use std::{
    boxed,
    sync::Mutex,
    thread,
    time::{SystemTime, UNIX_EPOCH},
};

use actix_web::{
    get, middleware, post,
    web::{self, Data},
    App, HttpResponse, HttpServer, Responder,
};

use serde::{Deserialize, Serialize};
use serde_json::json;

use rusqlite::{params, Connection, ParamsFromIter, Result, ToSql};

use tauri::{
    api, AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, Window,
};

struct AppState {
    app_name: String,
}

// #[derive(Serialize)]
#[derive(Clone, serde::Serialize)]
struct ExtensionInfo {
    id: String,
    name: String,
    version: String,
    icon: String,
    commands: String,
}

#[derive(Deserialize)]
struct UpsertExtensionInput {
    id: String,
    name: String,
    version: String,
    icon: String,
    commands: String,
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("Quit".to_string(), "Quit");
    let show = CustomMenuItem::new("Show".to_string(), "Show");
    let hide = CustomMenuItem::new("Hide".to_string(), "Hide");
    let editor = CustomMenuItem::new("Editor".to_string(), "Editor");
    let preferences = CustomMenuItem::new("Preferences".to_string(), "Preferences");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_item(editor)
        .add_item(preferences)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    SystemTray::new().with_menu(tray_menu)
}

#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}

#[tauri::command]
fn greet(name: &str) {
    hello::say_hello(name)
}

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello, World!")
}

#[post("/api/upsert-extension")]
async fn upsert_extension(
    input: web::Json<UpsertExtensionInput>,
    app: web::Data<AppHandle>,
) -> HttpResponse {
    let info = ExtensionInfo {
        id: input.id.to_string(),
        name: input.name.to_string(),
        version: input.version.to_string(),
        icon: input.icon.to_string(),
        commands: input.commands.to_string(),
    };

    let window = app.get_window("main").unwrap();
    window.emit("UPSERT_EXTENSION", json!(info)).unwrap();

    HttpResponse::Ok().json(info)
}

// This struct represents state

#[actix_web::main]
pub async fn start_server(app: AppHandle, conn: Connection) -> std::io::Result<()> {
    // let tauri_app = web::Data::new(Mutex::new(app));

    // let db = web::Data::new(Mutex::new(conn));

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState {
                app_name: String::from("Actix Web"),
            }))
            .app_data(web::Data::new(app.clone()))
            // .app_data(db.clone())
            .wrap(middleware::Logger::default())
            .service(index)
            .service(upsert_extension)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init()) // add this line
        .invoke_handler(tauri::generate_handler![on_button_clicked, greet,])
        .system_tray(create_system_tray())
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "Hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "Show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Editor" => {
                    let window = app.get_window("editor").unwrap();
                    window.emit("MenuEditorClicked", Some("Yes")).unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Preferences" => {
                    let window = app.get_window("main").unwrap();
                    window.emit("PreferencesClicked", Some("Yes")).unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            let handle = app.handle();
            let conn = Connection::open_in_memory();

            let boxed_handle = Box::new(handle);
            let boxed_conn = Box::new(conn.unwrap());

            thread::spawn(move || start_server(*boxed_handle, *boxed_conn).unwrap());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
