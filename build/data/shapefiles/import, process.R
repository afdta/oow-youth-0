library("rgdal")
library("tidyr")
library("broom")
library("ggplot2")

setwd("/home/alec/Projects/Brookings/out-of-work/build/data")

#previous data lacked leading zeros
pd_no0 <- read.csv("cluster, supercluster distribution by puma [no leading zeros].csv", stringsAsFactors=FALSE, colClasses=c(stpuma="character"))

#revised data, output from excel doc
pumadat <- read.csv("cluster, supercluster distribution by puma.csv", stringsAsFactors=FALSE, colClasses=c(stpuma="character"))

#test
all.equal(pumadat, pd_no0)
sum(as.numeric(pumadat$stpuma)==as.numeric(pd_no0$stpuma))

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

sp2 <- merge(sp1, pumadat2, by.x="GEOID10", by.y="stpuma", all.x=FALSE)[, c(1,11:27)]

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


#################################################RUN SOME MAP TESTS

#plot dc
plot(sp2[sp2@data$FIPS_final=="11001a",])

fort <- tidy(sp2[sp2@data$FIPS_final=="11001a",], region="GEOID10")
fort2 <- merge(fort, pumadat2, by.x="id", by.y="stpuma", all=FALSE)

# 1.“Young, less-educated, and diverse” (supercluster 3)
# 2.“Less-educated prime-age people” (supercluster 1)
# 3.“Diverse, less-educated, and eyeing retirement” (supercluster 2)
# 4.“Motivated and moderately educated younger people” (supercluster 5)
# 5.“Moderately educated older people” (supercluster 4)
# 6.“Highly educated and engaged younger people” (supercluster 7)
# 7.“Highly educated, high-income older people” (supercluster 6)

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc3)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6")

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc1)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6") + title("Less educated prime age")

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc5)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6") + title("Motivated and moderately edu young")

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc4)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6") + title("moderately older")

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc7)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6") + title("hi ed young")

ggplot() + geom_polygon(data=fort2, aes(x=long, y=lat, group=id, fill=sc6)) + 
  scale_fill_continuous(low="#ffffff", high="#0d73d6") + title("hi ed hi inc")

