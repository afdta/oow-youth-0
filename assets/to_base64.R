library(base64enc)
library(here)
library(jsonlite)

files <- list.files(here("assets/SVG/"))

to64 <- function(nm){
  b64 <- base64encode(here(paste0("assets/SVG/",nm)))
  return(list(avatar=unbox(paste0("avatar", gsub("[^0-9]", "", nm))), b64=unbox(b64)) )
}

files_ <- lapply(files[1:12], to64)

json_avatars <- toJSON(files_, pretty=TRUE)

writeLines(json_avatars, here("build/js/avatars.js"))
