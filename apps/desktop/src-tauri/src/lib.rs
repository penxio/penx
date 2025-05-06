mod server;

use rusqlite::{Connection, ParamsFromIter, Result, ToSql};
use std::{path::PathBuf, thread};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|mut app| {
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;

            let handle = app.handle();
            let conn = Connection::open_in_memory();

            // let boxed_handle = Box::new(handle);
            let boxed_conn = Box::new(conn.unwrap());

            let app_state = server::AppState {
                app_name: String::from("Actix Web"),
                data: String::from("initial data"),
            };

            let boxed_app_state = Box::new(app_state);
            let app_handle = app.handle().clone();
            thread::spawn(move || {
                server::start_server(app_handle, *boxed_conn, *boxed_app_state).unwrap()
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
