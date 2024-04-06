import React from "react";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Add css for snow theme

const QuillEditor = ({ onEditorChange }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],
        ["clean"], // remove formatting button
      ],
    },
  });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        const content = quillRef.current.firstChild.innerHTML;
        onEditorChange(content);
      });
    }
  }, [quill, onEditorChange]);

  return (
    <div style={{ width: "42.4vw", height: "17vh" }}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillEditor;
