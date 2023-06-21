package api

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TodosApi struct {
}

type todo struct {
	ID        string `json:"id"`
	Item      string `json:"item"`
	Completed bool   `json:"completed"`
}

var todos = []todo{
	{ID: "1", Item: "Clean Room", Completed: false},
	{ID: "2", Item: "Clean Kitchen", Completed: false},
	{ID: "3", Item: "Bring Trash out", Completed: false},
}

func (api *TodosApi) getTodoById(id string) (*todo, error) {
	for i, todo := range todos {
		if todo.ID == id {
			return &todos[i], nil
		}
	}
	return nil, errors.New(fmt.Sprintf("todo with id='%s' not found", id))
}

func (api *TodosApi) getTodo(context *gin.Context) {
	id := context.Param("id")
	todo, err := api.getTodoById(id)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, todo)
}

func (api *TodosApi) getTodos(context *gin.Context) {
	context.IndentedJSON(http.StatusOK, todos)
}

func (api *TodosApi) addTodo(context *gin.Context) {
	var newTodo todo
	if err := context.BindJSON(&newTodo); err != nil {
		return
	}
	todos = append(todos, newTodo)
	context.IndentedJSON(http.StatusCreated, newTodo)
}

func (api *TodosApi) setTodoCompleted(context *gin.Context) {
	id := context.Param("id")
	todo, err := api.getTodoById(id)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
	completed, err := strconv.ParseBool(context.Query("completed"))
	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	todo.Completed = completed
	context.IndentedJSON(http.StatusOK, todo)
}

func (api *TodosApi) Bind(router *gin.Engine) {
	router.GET("/todos", api.getTodos)
	router.GET("/todos/:id", api.getTodo)
	router.PATCH("/todos/:id", api.setTodoCompleted)
	router.POST("/todos", api.addTodo)
	router.Run("localhost:8080")
}
