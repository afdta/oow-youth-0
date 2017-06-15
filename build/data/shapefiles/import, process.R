library("rgdal")
library("tidyr")

setwd("/home/alec/Projects/Brookings/out-of-work/build/data")

distribution <- read.csv("supercluster distribution by geo.csv", stringsAsFactors = FALSE) %>%
  gather(superclus, share, supercluster_pct1:supercluster_pct7) %>%
  separate(superclus, c("level","superclus2"), "_pct", convert=TRUE)

pumadat <- read.csv("cluster, supercluster distribution by puma.csv", stringsAsFactors=FALSE, colClasses=c(stpuma="character"))
pumadat2 <- pumadat[c(1,3,6:21)]
names(pumadat2) <- sub("pct_supercluster", "sc", names(pumadat2))
names(pumadat2) <- sub("pct_cluster", "grp", names(pumadat2))

#ff <- unique(xwalk[c("FIPS_final", "display_geo")])

#- Export_Output is a shapefile of primary cities; there are 24 jurisdictions whose "display_geo" ID relates to this file
#- mergedshapefile is a shapefile of all PUMAs in the US
#- higgins geos is a shapefile of PUMAs aggregated to the geos of interest

sp1 <- readOGR("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles", layer="mergedshapefile")
#higgins <-readOGR("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles", layer="higgins geos")
#places <-readOGR("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles", layer="Export_Output")

sp2 <- merge(sp1, pumadat2, by.x="GEOID10", by.y="stpuma", all.x=FALSE)[c(1,11:27)]

pumadat3 <- sp2@data
test <- merge(pumadat3, pumadat2, by.x=c("GEOID10", "FIPS_final"), by.y=c("stpuma", "FIPS_final"))
all.equal(test[3:18],test[19:34])

#write out shapefiles
places <- unique(sp2@data$FIPS_final)

makeWriteShp <- function(place_input){
  place <- as.character(place_input)
  g <- sp2[as.character(sp2@data$FIPS_final)==place & !is.na(sp2@data$FIPS_final),]
  writeOGR(g, "/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles/subsetted/esri/", place, driver="ESRI Shapefile")
  #writeOGR(g, paste0("/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles/subsetted/geojson/",place), "puma", driver="GeoJSON")
}

for(p in places){
  makeWriteShp(p)
}



