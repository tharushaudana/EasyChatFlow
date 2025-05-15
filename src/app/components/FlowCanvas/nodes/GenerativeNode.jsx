import { Handle, Position } from "@xyflow/react";

export default function GenerativeNode({ data }) {
    return (
        <div className="p-3 rounded-xl bg-green-100 shadow-md w-64 text-left">
            <Handle type="target" position={Position.Left} isConnectable />
            <p className="font-bold mb-2">{data.label}</p>
            <pre className="text-xs bg-white p-2 rounded overflow-auto">{data.code}</pre>
            <button 
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={data.onGenerate}
            >
                Generate
            </button>
            <Handle type="source" position={Position.Right} isConnectable />
        </div>
    );
};