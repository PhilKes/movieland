package api

import "github.com/gin-gonic/gin"

type Api interface {
	Bind(router *gin.Engine)
}
