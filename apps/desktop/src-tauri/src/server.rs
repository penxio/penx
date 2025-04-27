use actix_cors::Cors;
use actix_web::{get, http, middleware, post, web, App, HttpResponse, HttpServer, Responder};

use serde::{Deserialize, Serialize};
use serde_json::json;

use rusqlite::Connection;

use tauri::{AppHandle, Manager};

#[derive(Clone)]
pub struct AppState {
    pub app_name: String,
    pub data: String,
    // app_name: RefCell<String>,
    // data: RefCell<String>,
}

#[derive(Clone, serde::Serialize)]
struct ExtensionInfo {
    name: String,
    title: String,
    version: String,
    icon: String,
    assets: String,
    commands: String,
}

#[derive(Deserialize)]
struct UpsertExtensionInput {
    name: String,
    title: String,
    version: String,
    icon: String,
    assets: String,
    commands: String,
}

#[derive(Clone, serde::Serialize)]
struct LoginInfo {
    user: String,
    mnemonic: String,
}

#[derive(Deserialize)]
struct LoginInput {
    user: String,
    mnemonic: String,
}

#[derive(Serialize)]
struct HelloResponse {
    hello: String,
}

// the payload type must implement `Serialize` and `Clone`.

#[get("/")]
async fn index(app: web::Data<AppHandle>) -> impl Responder {
    // let data = &app_state.app_name;
    // HttpResponse::Ok().body(format!("Hello, World! {}", data))

    let response = HelloResponse {
        hello: "world".to_string(),
    };
    HttpResponse::Ok().json(response)
}

#[get("/open-window")]
async fn open_window(app: web::Data<AppHandle>) -> impl Responder {
    // let data = &app_state.app_name;
    // HttpResponse::Ok().body(format!("Hello, World! {}", data))

    let window = app.get_webview_window("main").unwrap();

    window.show();
    window.set_focus();

    let response = HelloResponse {
        hello: "world".to_string(),
    };
    HttpResponse::Ok().json(response)
}

#[post("/api/login")]
async fn login(input: web::Json<LoginInput>, app: web::Data<AppHandle>) -> HttpResponse {
    let info = LoginInfo {
        user: input.user.to_string(),
        mnemonic: input.mnemonic.to_string(),
    };
    let window = app.get_webview_window("main").unwrap();
    // window.emit("DESKTOP_LOGIN", json!(info)).unwrap();

    HttpResponse::Ok().json(info)
}

#[post("/api/upsert-extension")]
async fn upsert_extension(
    input: web::Json<UpsertExtensionInput>,
    app: web::Data<AppHandle>,
) -> HttpResponse {
    let info = ExtensionInfo {
        name: input.name.to_string(),
        title: input.title.to_string(),
        version: input.version.to_string(),
        icon: input.icon.to_string(),
        assets: input.assets.to_string(),
        commands: input.commands.to_string(),
    };

    let window = app.get_webview_window("main").unwrap();
    // window.emit("UPSERT_EXTENSION", json!(info)).unwrap();

    HttpResponse::Ok().json(info)
}

#[derive(Deserialize)]
struct QueryParams {
    extension_id: String,
}

#[get("/extension")]
async fn extension(web::Query(params): web::Query<QueryParams>) -> impl Responder {
    let html = format!(
        r#"
        <!DOCTYPE html>
        <html>
          <body>
            <div id="root" style="color: red">Root</div>
            <script src="./dist/{}.js"></script>
            <script src="/extension_js/hello.js"></script>
          </body>
        </html>
    "#,
        params.extension_id
    );

    HttpResponse::Ok().body(html)
}

#[get("/extension_js/{name}.js")] // <- define path parameters
async fn extension_js(path: web::Path<(String)>) -> impl Responder {
    let js_str = "console.log(\"hello world....\");alert(123);";

    HttpResponse::Ok()
        .content_type("application/javascript")
        .body(js_str)
}

#[actix_web::main]
pub async fn start_server(
    app: AppHandle,
    conn: Connection,
    app_state: AppState,
) -> std::io::Result<()> {
    // let tauri_app = web::Data::new(Mutex::new(app));

    // let db = web::Data::new(Mutex::new(conn));

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            // .app_data(web::Data::new(AppState {
            //     app_name: String::from("Actix Web"),
            //     data: String::from("initial data"),
            //     app_name: RefCell::new("Actix Web".to_string()),
            //     data: RefCell::new("initial data".to_string()),
            // }))
            .app_data(web::Data::new(app_state.clone()))
            .app_data(web::Data::new(app.clone()))
            // .app_data(db.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(index)
            .service(open_window)
            .service(login)
            .service(upsert_extension)
            .service(extension)
            .service(extension_js)
    })
    .bind(("127.0.0.1", 14158))?
    .run()
    .await
}
