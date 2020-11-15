import 'source-map-support/register'
import { TodosAccess } from '../dataLayer/TodosAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getTodoItemsUserId(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()
  const timestamp = new Date().toISOString()

  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: timestamp,
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  }
  await todosAccess.createTodoItem(newItem)

  return newItem
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest) {
  todosAccess.updateTodoItem(todoId, updateTodoRequest as TodoUpdate)
}

export async function deleteTodo(todoId: string) {
  todosAccess.deleteTodoItem(todoId)
}

export async function getUploadUrl(attachmentId: string): Promise<string> {
  const uploadUrl = await todosAccess.getUploadUrl(attachmentId)
  return uploadUrl
}

export async function createAttachmentUrl(todoId: string, attachmentId: string): Promise<string> {
  const uploadUrl = await todosAccess.createAttachmentUrl(todoId, attachmentId)
  return uploadUrl
}
