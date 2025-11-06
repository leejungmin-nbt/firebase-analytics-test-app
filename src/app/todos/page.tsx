"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  trackTodoAdded,
  trackTodoDeleted,
  trackTodoToggled,
  trackEvent,
} from "@/lib/analytics";
import { getConfigString } from "@/lib/remoteConfig";
import { useRemoteConfig } from "@/components/RemoteConfigProvider";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "잘자기", completed: false },
    { id: 2, text: "공부하기", completed: false },
    { id: 3, text: "운동하기", completed: false },
    { id: 4, text: "일하기", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [buttonColor, setButtonColor] = useState("f");

  const { isInitialized } = useRemoteConfig();

  console.log("isInitialized >> ", isInitialized);

  useEffect(() => {
    //Remote Config(외부 시스템)와 동기화하기 위해 setState 사용
    if (isInitialized) {
      const color = getConfigString("todo_add_button_color", "red");
      // eslint-disable-next-line
      setButtonColor(color);

      trackEvent("ab_test_exposed", {
        experiment_name: "todo_add_button_color",
        variant: color,
      });
      console.log("A/B 테스트 버튼 색상:", color);
    }
  }, [isInitialized]);

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");

    trackTodoAdded(newTodo.id, newTodo.text);
    trackEvent("button_click", {
      button_name: "todo_add_button",
      experiment_name: "todo_add_button_color",
      variant: buttonColor,
    });
  };

  const handleDeleteTodo = (id: number) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    setTodos(todos.filter((todo) => todo.id !== id));

    // Firebase Analytics 이벤트 전송
    trackTodoDeleted(id, todoToDelete?.text);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newCompletedState = !todo.completed;
          // Firebase Analytics 이벤트 전송
          trackTodoToggled(id, newCompletedState);
          return { ...todo, completed: newCompletedState };
        }
        return todo;
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← 홈으로
        </Link>
        <h1 className={styles.title}>투두리스트</h1>
        <p className={styles.subtitle}>추가/삭제 이벤트를 트래킹합니다</p>
      </div>

      <div className={styles.content}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            placeholder="할 일을 입력하세요..."
            className={styles.input}
          />
          <button
            onClick={handleAddTodo}
            className={styles.addButton}
            style={{ backgroundColor: buttonColor }}
          >
            추가
          </button>
        </div>

        <div className={styles.todoList}>
          {todos.length === 0 ? (
            <p className={styles.emptyMessage}>
              할 일이 없습니다. 새로운 할 일을 추가해보세요!
            </p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  className={styles.checkbox}
                />
                <span
                  className={`${styles.todoText} ${
                    todo.completed ? styles.completed : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>

        <div className={styles.stats}>
          <p>전체: {todos.length}개</p>
          <p>완료: {todos.filter((t) => t.completed).length}개</p>
          <p>미완료: {todos.filter((t) => !t.completed).length}개</p>
        </div>
      </div>
    </div>
  );
}
