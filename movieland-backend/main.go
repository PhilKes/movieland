package main

import (
	"github.com/PhilKes/movieland/api"
	"github.com/gin-gonic/gin"
)

func test(api api.Api) {

}

var apis []api.Api = []api.Api{
	&api.TodosApi{},
}

func main() {
	router := gin.Default()
	for _, api := range apis {
		api.Bind(router)
	}
	router.Run("localhost:8080")
}
