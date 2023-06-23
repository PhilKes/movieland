package main

import (
	"os"

	"github.com/PhilKes/movieland/api"
	"github.com/PhilKes/movieland/model"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var apis []api.Api = []api.Api{
	&api.MoviesApi{},
}

func main() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	log.Info().Msg("Starting Server")
	var router *gin.Engine = gin.Default()
	model.ConnectDatabase()

	for _, api := range apis {
		api.Bind(router)
	}
	router.Run(":8080")
}
