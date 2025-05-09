import { Handle, Position } from "@xyflow/react";

export default function TextNode({ data }) {
    return (
        <div className="p-3 rounded-xl bg-yellow-100 shadow-md w-60 text-left">
            <Handle type="target" position={Position.Left} isConnectable />
            <p className="font-bold mb-2">{data.label}</p>
            <p className="text-sm whitespace-pre-wrap">{data.text}</p>
            <Handle type="source" position={Position.Right} isConnectable />
        </div>
    );
};