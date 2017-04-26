#read in raw data, export rds
setwd("~/Projects/Brookings/out-of-work/build/data/pre-handoff")

files <- list.files("./raw/")

readf <- function(file){
  f <- paste0("./raw/", file)

  fc <- gsub("-|\\s", "_", file)
  fc <- sub("\\.csv", "", fc)
  
  cat("Reading in data from ")
  cat(f)
  cat("\n")
  
  d <- read.csv(f, stringsAsFactors = FALSE)
  
  saveRDS(d, paste0(fc,".rds"))
  
  return(d)
}

one <- readf(files[1])
two <- readf(files[2])
three <- readf(files[3])
four <- readf(files[4])
five <- readf(files[5])
six <- readf(files[6])
