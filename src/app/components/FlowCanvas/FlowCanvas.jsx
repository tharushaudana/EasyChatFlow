"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    ReactFlowProvider,
    useReactFlow,
    useStoreApi,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import ImageNode from "./nodes/ImageNode";
import TextNode from "./nodes/TextNode";
import GenerativeNode from "./nodes/GenerativeNode";

const initialNodes = [
    {
        id: "1",
        type: "imageCard",
        position: { x: 0, y: 50 },
        data: { label: "Image Card", imageUrl: "https://via.placeholder.com/150" },
    },
    {
        id: "12",
        type: "imageCard",
        position: { x: 0, y: 100 },
        data: { label: "Image Card", imageUrl: "https://via.placeholder.com/150" },
    },
    {
        id: "13",
        type: "imageCard",
        position: { x: 0, y: 150 },
        data: { label: "Image Card", imageUrl: "https://via.placeholder.com/150" },
    },
    {
        id: "2",
        type: "textCard",
        position: { x: 300, y: 50 },
        data: { label: "Text Card", text: "Styles: rounded-lg, bg-white, shadow-lg" },
    },
    {
        id: "3",
        type: "generativeCard",
        position: { x: 600, y: 50 },
        data: { label: "AI Generative Card", code: "// AI generated code here" },
    },
];

const initialEdges = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
        type: "default",
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
    {
        id: "e12-2",
        source: "12",
        target: "2",
        animated: true,
        type: "default",
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
    {
        id: "e13-2",
        source: "13",
        target: "2",
        animated: true,
        type: "default",
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
    {
        id: "e2-3",
        source: "2",
        target: "3",
        animated: true,
        type: "default",
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
];

const getBackTrace = (node, store) => {
    const backTrace = [];

    const traverse = (currentNode) => {
        if (!currentNode) return;
        backTrace.push(currentNode);
        const incomingEdges = store.getState().edges.filter((edge) => edge.target === currentNode.id);
        incomingEdges.forEach((edge) => {
            const sourceNode = store.getState().nodes.find((node) => node.id === edge.source);

            // if (incomingEdges)
            traverse(sourceNode);
        });
        
        // stop if incoming edges are more than 1

        // if (incomingEdges.length > 1) {
        //     backTrace.push(currentNode);
        //     return;
        // }
        
    };

    traverse(node);
    return backTrace.reverse();
}


const withDeleteButton = (Component, store, setAffectedEdges) => (props) => {
    const { id, type } = props;
    const { setNodes, getNode } = useReactFlow();

    const data = {...props.data};

    if (type === "generativeCard") {
        data.onGenerate = async () => {
            const node = getNode(id);
            const backTrace = getBackTrace(node, store);
            console.log(backTrace);
        };
    }
    
    return (
        <div className="relative">
            <Component data={data} />
            <button
                onClick={() => setNodes((nds) => nds.filter((node) => node.id !== id))}
                className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full px-1"
            >
                ✕
            </button>
        </div>
    );
};

// const nodeTypes = {
//     imageCard: withDeleteButton(ImageNode),
//     textCard: withDeleteButton(TextNode),
//     generativeCard: withDeleteButton(GenerativeNode),
// };

function FlowCanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const store = useStoreApi();

    const [affectedEdges, setAffectedEdges] = useState([]);

    const nodeTypes = useMemo(() => ({
        imageCard: withDeleteButton(ImageNode, store, setAffectedEdges),
        textCard: withDeleteButton(TextNode, store, setAffectedEdges),
        generativeCard: withDeleteButton(GenerativeNode, store, setAffectedEdges),
    }), [store, setAffectedEdges]);

    const onConnect = (params) =>
        setEdges((eds) =>
            addEdge(
                {
                    ...params,
                    animated: true,
                    type: "default",
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                },
                eds
            )
        );

    const onEdgeUpdate = (oldEdge, newConnection) =>
        setEdges((eds) =>
            eds.map((e) => (e.id === oldEdge.id ? { ...newConnection, id: oldEdge.id } : e))
        );

    const onEdgeDelete = (edgesToDelete) => {
        setEdges((eds) => eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id)));
    };

    const addNode = (type) => {
        const id = uuidv4();
        const position = { x: Math.random() * 800, y: Math.random() * 400 };
        const base = {
            id,
            type,
            position,
            data: {},
        };
        if (type === "imageCard") {
            base.data = {
                label: "Image Card",
                imageUrl: "https://via.placeholder.com/150",
            };
        } else if (type === "textCard") {
            base.data = {
                label: "Text Card",
                text: "Add your styles/notes here...",
            };
        } else if (type === "generativeCard") {
            base.data = {
                label: "Generative Card",
                code: "// Generated code will appear here",
            };
        }
        setNodes((nds) => [...nds, base]);
    };

    const onKeyDown = useCallback(
        (event) => {
            if (event.key === "Delete") {
                const selectedEdges = store.getState().edges.filter((e) => e.selected);
                if (selectedEdges.length > 0) {
                    setEdges((eds) => eds.filter((e) => !selectedEdges.find((sel) => sel.id === e.id)));
                }
            }
        },
        [setEdges, store]
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    const nodeSummary = useMemo(() => {
        return {
            image: nodes.filter((n) => n.type === "imageCard").length,
            text: nodes.filter((n) => n.type === "textCard").length,
            gen: nodes.filter((n) => n.type === "generativeCard").length,
        };
    }, [nodes]);

    // Style edges based on selection
    const styledEdges = useMemo(() => {
        return edges.map((edge) => ({
            ...edge,
            style: {
                stroke: edge.selected ? "blue" : "#999",
                strokeWidth: edge.selected ? 2 : 1,
            },
        }));
    }, [edges]);

    return (
        <div className="w-full h-screen relative">
            {/* Top Summary Panel */}
            <div className="absolute z-10 top-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-2 flex gap-4 text-sm font-semibold">
                <span className="text-blue-600">Image Cards: {nodeSummary.image}</span>
                <span className="text-yellow-600">Text Cards: {nodeSummary.text}</span>
                <span className="text-green-600">Gen Cards: {nodeSummary.gen}</span>
            </div>

            <div className="absolute z-10 top-2 left-2 flex gap-2">
                <button
                    onClick={() => addNode("imageCard")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    + Image Card
                </button>
                <button
                    onClick={() => addNode("textCard")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                    + Text Card
                </button>
                <button
                    onClick={() => addNode("generativeCard")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    + Gen Card
                </button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={styledEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdate={onEdgeUpdate}
                onEdgesDelete={onEdgeDelete}
                nodeTypes={nodeTypes}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}

export default function FlowCanvas() {
    return (
        <ReactFlowProvider>
            <FlowCanvasInner />
        </ReactFlowProvider>
    );
}
