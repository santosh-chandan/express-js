
export const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err.message);

    // Default HTTP status code
    const statusCode = err.statusCode || 500;

    // Standard error response structure
    res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
}
