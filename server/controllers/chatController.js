const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] },
    })
      .populate('participants', 'name avatar role companyName location isVerified')
      .populate('deal', 'title status agreedPrice')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create conversation with another user
// @route   POST /api/chat/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, dealId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient ID is required' });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
    }

    // Check if conversation already exists between these 2 users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
    })
      .populate('participants', 'name avatar role companyName location isVerified')
      .populate('deal', 'title status agreedPrice');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId],
        deal: dealId || null,
        lastMessage: {
          text: 'Conversation started',
          sender: req.user.id,
          createdAt: new Date(),
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar role companyName location isVerified')
        .populate('deal', 'title status agreedPrice');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.map((p) => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view messages in this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        recipient: req.user.id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text, attachments } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const recipientId = conversation.participants.find(
      (p) => p.toString() !== req.user.id
    );

    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient not found in conversation' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      recipient: recipientId,
      text,
      attachments: attachments || [],
      isRead: false,
    });

    // Update last message in conversation
    conversation.lastMessage = {
      text,
      sender: req.user.id,
      createdAt: new Date(),
    };
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};
