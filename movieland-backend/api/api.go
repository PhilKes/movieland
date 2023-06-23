package api

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Api interface {
	Bind(router *gin.Engine)
}

// BindJSON tries to parse given Request Body from JSON to object.
// Return appropriate HTTP Response if Body could not be parsed.
func BindJSON[T any](context *gin.Context, obj *T) (*T, error) {
	if err := context.BindJSON(&obj); err != nil {
		return nil, HandleBindJSONError(context, err)
	}
	return obj, nil
}

func handleParamError(context *gin.Context, paramType string, param string, writeErrResponse bool) (string, error) {
	msg := fmt.Sprintf("%s param %s is not present", paramType, param)
	if writeErrResponse {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": msg})
	}
	return "", errors.New(msg)
}

// ParsePathParam tries to get the given query param as string.
// Returns appropriate HTTP Response if param is not present
func ParseQueryParam(context *gin.Context, param string, writeErrResponse bool) (string, error) {
	strValue := context.Query(param)
	if strValue == "" {
		return handleParamError(context, "Query", param, writeErrResponse)
	}
	return strValue, nil
}

// ParsePathParam tries to get the given query param as string.
// Returns appropriate HTTP Response if param is not present
func ParsePathParam(context *gin.Context, param string, writeErrResponse bool) (string, error) {
	strValue := context.Param(param)
	if strValue == "" {
		return handleParamError(context, "Path", param, writeErrResponse)
	}
	return strValue, nil
}

// ParsePathParamAsUInt64 tries to parse given Request param to uint64.
// Returns appropriate HTTP Response if param could not be parsed to uint64
func ParsePathParamAsUInt64(context *gin.Context, param string, writeErrResponse bool) (uint64, error) {
	strValue, err := ParsePathParam(context, param, writeErrResponse)
	if err != nil {
		return 0, err
	}
	value, err := strconv.ParseUint(strValue, 10, 64)
	if err != nil {
		if writeErrResponse {
			context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		}
		return 0, err
	}
	return value, nil
}
