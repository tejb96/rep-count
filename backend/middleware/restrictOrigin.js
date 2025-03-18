const restrictOrigin = (req, res, next) => {
    const allowedOrigin = 'https://repvision.tsbprojects.com';
    const requestOrigin = req.headers.origin;
    if (requestOrigin !== allowedOrigin) {
        return res.status(403).json({ message: "Origin not allowed" });
    }
    next();
};