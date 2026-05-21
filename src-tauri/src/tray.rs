use tauri::{
    tray::TrayIconBuilder,
    menu::{MenuBuilder, MenuItemBuilder},
    image::Image,
    App, Manager, Emitter,
};

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let show = MenuItemBuilder::with_id("show", "Show / Hide").build(app)?;
    let settings = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&show)
        .item(&settings)
        .separator()
        .item(&quit)
        .build()?;

    let icon = tray_icon();

    let _handle = app.handle().clone();
    let _tray = TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .tooltip("Clipboard Workbench")
        .on_menu_event(move |app, event| {
            match event.id().as_ref() {
                "show" => {
                    if let Some(w) = app.get_webview_window("main") {
                        if w.is_visible().unwrap_or(false) {
                            let _ = w.hide();
                        } else {
                            let _ = w.show();
                            let _ = w.set_focus();
                        }
                    }
                }
                "settings" => {
                    let _ = app.emit("navigate", "settings");
                    if let Some(w) = app.get_webview_window("main") {
                        let _ = w.show();
                        let _ = w.set_focus();
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}

fn tray_icon() -> Image<'static> {
    let w = 32;
    let h = 32;
    let mut rgba = Vec::with_capacity(w * h * 4);
    for y in 0..h {
        for x in 0..w {
            let inside = x >= 6 && x < 26 && y >= 4 && y < 28;
            let border_h = (y == 4 || y == 27) && x >= 6 && x < 26;
            let border_v = (x == 6 || x == 25) && y >= 4 && y < 28;
            let top_bar = y >= 2 && y <= 4 && x >= 10 && x < 22;
            let top_ends = (x == 10 || x == 21) && y >= 2 && y <= 4;

            if inside || border_h || border_v || top_bar || top_ends {
                rgba.extend_from_slice(&[59, 130, 246, 255]);
            } else {
                rgba.extend_from_slice(&[0, 0, 0, 0]);
            }
        }
    }
    Image::new_owned(rgba, w as u32, h as u32)
}
