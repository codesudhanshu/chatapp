import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTypingStatus } = useChatStore();
  let typingTimeout = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);

    // Notify that user is typing
    sendTypingStatus(true);

    // Clear previous timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // Set a timeout to stop typing after 2 seconds
    typingTimeout.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      sendTypingStatus(false); // Stop typing after sending a message
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
            <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
        />
        <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
