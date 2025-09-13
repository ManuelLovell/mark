import path from 'path'

export default {
    server: { cors: true },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                labelpicker: path.resolve(__dirname, "labelpicker.html")
            }
        }
    }
}