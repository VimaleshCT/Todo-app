import React, { useEffect, useReducer, useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type Action =
  | { type: "ADD"; payload: string }
  | { type: "DELETE"; payload: number }
  | { type: "UPDATE"; payload: { id: number; title: string } };

const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    // case "LOAD":
    //   return action.payload;

    case "ADD":
      return [
        { id: Date.now(), title: action.payload, completed: false },
        ...state,
      ];

    case "DELETE":
      return state.filter((t) => t.id !== action.payload);

    case "UPDATE":
      return state.map((t) =>
        t.id === action.payload.id
          ? { ...t, title: action.payload.title }
          : t
      );

    default:
      return state;
  }
};

const STORAGE_KEY = "todos"

const App: React.FC = () => {

  const [input, setInput] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const initTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};
const [todos, dispatch] = useReducer(todoReducer, [], initTodos);

  // useEffect(() => {
  //   const stored = localStorage.getItem(STORAGE_KEY);
  //   if (stored) {
  //     dispatch({ type: "LOAD", payload: JSON.parse(stored) });
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD", payload: trimmed });
    setInput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5">

        <h1 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          ToDo List
          <ListAltOutlinedIcon fontSize="small" />
        </h1>
        <div className="flex gap-3 mb-5">
          <input
            className="flex-1 border border-blue-400 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add your items"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />

          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="bg-blue-500 text-white px-4 rounded-md text-sm font-medium disabled:opacity-40"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-teal-100 rounded-md px-3 py-2 flex items-center justify-between"
            >
              {editingId === todo.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  className="flex-1 mr-3 px-2 py-1 text-sm rounded border border-blue-400 outline-none"
                />
              ) : (
                <span className="text-sm text-gray-800">
                  {todo.title}
                </span>
              )}
              <div className="flex items-center gap-2">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => {
                        if (!editText.trim()) return;
                        dispatch({
                          type: "UPDATE",
                          payload: { id: todo.id, title: editText },
                        });
                        setEditingId(null);
                      }}
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs px-2 py-1 rounded border"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <EditOutlinedIcon
                      fontSize="small"
                      className="text-blue-700 cursor-pointer"
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditText(todo.title);
                      }}
                    />

                    <button
                      onClick={() =>
                        dispatch({ type: "DELETE", payload: todo.id })
                      }
                      className="bg-blue-700 p-2 rounded-md hover:bg-blue-800 transition"
                    >
                      <DeleteOutlineIcon
                        fontSize="small"
                        className="text-white"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-sm text-gray-300">
              No tasks yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
