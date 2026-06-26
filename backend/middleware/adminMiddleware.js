const admin = async (req, res, next) => {
    try {

        if (req.user && req.user.role === 'admin') {
            next()
        } else {
            res.status(403).json({ message: "Access Denied , admin only" })
        }

    } catch (error) {
        res.status(500).json({ message: "Access Denied , Server error" })
    }
}
module.exports = { admin }