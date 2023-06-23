package api

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

func getErrorMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "lte":
		return "Should be less than " + fe.Param()
	case "gte":
		return "Should be greater than " + fe.Param()
	}
	return "Unknown error"
}

type ErrorMsg struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// HandleBindJSONError return appropriate HTTP Response for given error.
func HandleBindJSONError(context *gin.Context, err error) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		out := make([]ErrorMsg, len(ve))
		for i, fe := range ve {
			out[i] = ErrorMsg{fe.Field(), getErrorMsg(fe)}
		}
		context.IndentedJSON(http.StatusBadRequest, gin.H{"errors": out})
		return err
	}
	context.IndentedJSON(http.StatusBadRequest, err.Error())
	return err
}

func HandleGormError(context *gin.Context, err error, notFoundMsg string) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": notFoundMsg})
		return err
	}
	context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error occurred"})
	return err
}
