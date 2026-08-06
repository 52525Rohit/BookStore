import Book from "../models/book.model.js";

export const getBook = async (req, res) => {
    try {
        const { page, limit } = req.query;
        let query = Book.find();
        if (page || limit) {
            const pageNum = Math.max(parseInt(page, 10) || 1, 1);
            const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
            query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
        }
        const book = await query;
        res.status(200).json(book);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: error.message });
    }
};