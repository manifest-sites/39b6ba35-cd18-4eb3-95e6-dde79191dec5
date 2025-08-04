import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Todo.json";
export const Todo = createEntityClient("Todo", schema);
