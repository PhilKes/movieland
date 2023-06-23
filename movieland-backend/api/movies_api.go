package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/PhilKes/movieland/model"
	"github.com/gin-gonic/gin"
)

type MoviesApi struct {
}

// func (api *MoviesApi) getTodoById(context *gin.Context, id uint64) (*model.Todo, error) {
// 	var todo *model.Todo
// 	err := model.DB.First(&todo, id).Error
// 	if err != nil {
// 		return nil, HandleGormError(context, err, fmt.Sprintf("Todo with id='%d' not found", id))
// 	}
// 	return todo, nil

// }

// func (api *MoviesApi) getTodo(context *gin.Context) {
// 	id, err := ParsePathParamAsUInt64(context, "id", true)
// 	if err != nil {
// 		return
// 	}
// 	todo, err := api.getTodoById(context, id)
// 	if err != nil {
// 		return
// 	}
// 	context.IndentedJSON(http.StatusOK, todo)
// }

// func (api *MoviesApi) deleteTodo(context *gin.Context) {
// 	id, err := ParsePathParamAsUInt64(context, "id", true)
// 	if err != nil {
// 		return
// 	}
// 	if model.DB.Delete(&model.Todo{}, id).RowsAffected == 0 {
// 		context.IndentedJSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("Todo with id='%d' not found", id)})
// 		return
// 	}

// 	context.IndentedJSON(http.StatusNoContent, nil)
// }

func (api *MoviesApi) getMovies(context *gin.Context) {
	search, err := ParseQueryParam(context, "search", false)
	var movies []model.Movie
	if err != nil {
		model.DB.Find(&movies)
	} else {
		model.DB.Find(&movies, "LOWER(name) LIKE ?", fmt.Sprintf("%%%s%%", strings.ToLower(search)))
	}
	if movies == nil {
		movies = make([]model.Movie, 0)
	}
	context.IndentedJSON(http.StatusOK, movies)
}

func (api *MoviesApi) addMovie(context *gin.Context) {
	movieInput, err := BindJSON(context, &model.Movie{})
	if err != nil {
		return
	}
	// newTodo := model.Todo{Item: todoInput.Item, Completed: todoInput.Completed}
	model.DB.Create(&movieInput)
	context.IndentedJSON(http.StatusCreated, movieInput)
}

// func (api *MoviesApi) setTodoCompleted(context *gin.Context) {
// 	id, err := ParsePathParamAsUInt64(context, "id", true)
// 	if err != nil {
// 		return
// 	}
// 	todo, err := api.getTodoById(context, id)
// 	if err != nil {
// 		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
// 		return
// 	}
// 	completed, err := strconv.ParseBool(context.Query("completed"))
// 	if err != nil {
// 		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
// 		return
// 	}
// 	todo.Completed = completed
// 	context.IndentedJSON(http.StatusOK, todo)
// }

func (api *MoviesApi) Bind(router *gin.Engine) {
	router.GET("/api/movies", api.getMovies)
	// router.GET("/todos/:id", api.getTodo)
	// router.DELETE("/todos/:id", api.deleteTodo)
	// router.PATCH("/todos/:id", api.setTodoCompleted)
	router.POST("/api/movies", api.addMovie)
}
