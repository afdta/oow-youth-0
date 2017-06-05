library("rgdal")

sp1 <- readOGR("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles", layer="mergedshapefile")
higgins <-readOGR("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles", layer="higgins geos")

dat <- sp1@data
