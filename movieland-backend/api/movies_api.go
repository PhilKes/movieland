package api

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/PhilKes/movieland/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

type PageRequest struct {
	Page     int
	PageSize int
}

func (pageRequest *PageRequest) GetOffset() int {
	return (pageRequest.Page - 1) * pageRequest.PageSize
}

type Pagination struct {
	PageRequest
	MaxPage int
	Content interface{}
}

func (api *MoviesApi) getPaginationFromQuery(context *gin.Context) (*PageRequest, error) {
	page, err := ParsePathParamAsInt(context, "page", true)
	if err != nil {
		return nil, err
	}
	if page < 1 {
		WriteErrorResponse(context, http.StatusBadRequest, "page parameter has to be greater than 0!")
		return nil, err
	}
	// pageSize, err := ParsePathParamAsInt(context, "pageSize", true)
	// if err != nil {
	// 	return nil, err
	// }
	// if pageSize < 1 {
	// 	WriteErrorResponse(context, http.StatusBadRequest, "pageSize parameter has to be greater than 0!")
	// 	return nil, err
	// }
	return &PageRequest{Page: int(page), PageSize: 1}, nil

}

func paginate(pageRequest *PageRequest) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(pageRequest.GetOffset()).Limit(pageRequest.PageSize)
	}
}

func executePaginatedQuery(value interface{}, pageRequest *PageRequest, conditions ...interface{}) *Pagination {
	pagination := &Pagination{Content: value}
	var totalRows int64
	if len(conditions) < 1 {
		model.DB.Model(&value).Count(&totalRows)
	} else {
		model.DB.Find(&value, conditions...).Count(&totalRows)
	}
	model.DB.Offset(pageRequest.GetOffset()).Limit(pageRequest.PageSize).Find(&pagination.Content, conditions...)
	pagination.MaxPage = int(math.Ceil(float64(totalRows) / float64(pageRequest.PageSize)))
	return pagination
}

func (api *MoviesApi) getMoviesPaged(context *gin.Context) {
	pageRequest, err := api.getPaginationFromQuery(context)
	if err != nil {
		return
	}
	name, err := ParseQueryParam(context, "name", false)
	var pagination *Pagination
	if err != nil {
		pagination = executePaginatedQuery(&model.Movie{}, pageRequest)
		// model.DB.Scopes(paginate(movies, pageRequest, pagination)).Find(&movies)
	} else {
		pagination = executePaginatedQuery(&model.Movie{}, pageRequest, "LOWER(name) LIKE ?", fmt.Sprintf("%%%s%%", strings.ToLower(name)))
		// model.DB.Scopes(paginate(movies, pageRequest, pagination)).Find(&movies, "LOWER(name) LIKE ?", fmt.Sprintf("%%%s%%", strings.ToLower(name)))
	}
	if pagination.Content == nil {
		pagination.Content = make([]*model.Movie, 0)
	}
	context.Header("hasMore", strconv.FormatBool(pagination.MaxPage > pageRequest.Page))
	context.IndentedJSON(http.StatusOK, pagination.Content)
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
	router.GET("/api/movies/page/:page", api.getMoviesPaged)
	// router.GET("/todos/:id", api.getTodo)
	// router.DELETE("/todos/:id", api.deleteTodo)
	// router.PATCH("/todos/:id", api.setTodoCompleted)
	router.POST("/api/movies", api.addMovie)
}
