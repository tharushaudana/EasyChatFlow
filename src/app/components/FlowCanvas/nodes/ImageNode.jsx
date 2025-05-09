import { Handle, Position } from "@xyflow/react";

export default function ImageNode({ data }) {
    return (
        <div className="p-2 rounded-xl bg-blue-100 shadow-md w-48 text-center">
            <Handle type="target" position={Position.Left} isConnectable />
            <p className="font-bold mb-2">{data.label}</p>
            <img src={data.imageUrl} alt="Component" className="rounded" />
            <Handle type="source" position={Position.Right} isConnectable />
        </div>
    );
};