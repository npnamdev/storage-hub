const express = require('express');
const router = express.Router();

const noteController = require('../controllers/noteController');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/', noteController.createNote);
// router.get('/', noteController.getAllNotes);
// router.get('/:id', noteController.getNoteById);
// router.patch('/:id', noteController.updateNoteById);
// router.delete('/:id', noteController.deleteNoteById);
// router.get('/user/:userId', noteController.getUserNotes);
// router.get('/category/:categoryId', noteController.getCategoryNotes);
// router.get('/search', noteController.searchNotes);
// router.get('/archived', noteController.getArchivedNotes);
// router.get('/deleted', noteController.getDeletedNotes);
// router.patch('/archive/:id', noteController.archiveNoteById);
// router.patch('/unarchive/:id', noteController.unarchiveNoteById);
// router.patch('/delete/:id', noteController.deleteNoteToTrash);
// router.patch('/restore/:id', noteController.restoreNoteFromTrash);
// router.get('/:id/attachments', noteController.getNoteAttachments);
// router.get('/:id/urls', noteController.getNoteUrls);
// router.post('/:id/attachments', noteController.attachFileToNote);
// router.post('/:id/urls', noteController.attachUrlToNote);


module.exports = router;






// createNote: Tạo một ghi chú mới.

// getAllNotes: Lấy tất cả các ghi chú.

// getNoteById: Lấy thông tin của một ghi chú cụ thể dựa trên ID.

// updateNoteById: Cập nhật thông tin của một ghi chú cụ thể dựa trên ID.

// deleteNoteById: Xóa một ghi chú cụ thể dựa trên ID.

// getUserNotes: Lấy tất cả các ghi chú của một người dùng dựa trên ID của người dùng.

// getCategoryNotes: Lấy tất cả các ghi chú trong một danh mục cụ thể dựa trên ID của danh mục.

// searchNotes: Tìm kiếm các ghi chú dựa trên từ khóa cung cấp trong truy vấn.

// getArchivedNotes: Lấy tất cả các ghi chú đã được lưu trữ (archive).

// getDeletedNotes: Lấy tất cả các ghi chú đã bị xóa.

// archiveNoteById: Lưu trữ (archive) một ghi chú cụ thể dựa trên ID.

// unarchiveNoteById: Khôi phục một ghi chú đã được lưu trữ (archive) dựa trên ID.

// deleteNoteToTrash: Xóa một ghi chú cụ thể dựa trên ID (chuyển ghi chú vào thùng rác).

// restoreNoteFromTrash: Khôi phục một ghi chú đã bị xóa dựa trên ID (chuyển ghi chú từ thùng rác trở lại).

// getNoteAttachments: Lấy danh sách các tệp đính kèm của một ghi chú cụ thể dựa trên ID.

// getNoteUrls: Lấy danh sách các liên kết URL đính kèm của một ghi chú cụ thể dựa trên ID.

// attachFileToNote: Đính kèm một tệp vào một ghi chú cụ thể dựa trên ID.

// attachUrlToNote: Đính kèm một liên kết URL vào một ghi chú cụ thể dựa trên ID.