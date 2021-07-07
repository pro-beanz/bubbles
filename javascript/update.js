// send events on property updates (Wallpaper Engine)
window.wallpaperPropertyListener = {
    applyUserProperties: (properties) => {
        for (let name in properties) {
            document.dispatchEvent(new CustomEvent(name, { detail: properties[name] }));
        }
    }
};