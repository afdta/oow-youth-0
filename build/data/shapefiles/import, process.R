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

fip <-c("1073c","4013b","4013a","4019c","6037b","6019c","6037a","6001c","6013c","6029c","6071c","6085c","6099c","6073c","6059c","6065c","6075a","6077c","6067c","6081c","6111c","8031a","8041c","9001c","9003c","9009c","10003c","11001a","12011c","12009c","12031a","12057c","12071c","12086c","12095c","12099c","12103c","12105c","13089c","13121c","13135c","13067c","15003c","17089c","17197c","17043c","17097c","17031b","17031a","18097a","20091c","21111a","24005c","24510a","24031c","24033c","24003c","25025a","25005c","25027c","25009c","26125c","26081c","26099c","26163b","26163a","27123c","27053c","29095c","29189c","31055c","32003a","32003b","34023c","34031c","34017c","34003c","34025c","34007c","34013c","34039c","34029c","35001a","36029c","36119c","36059c","36103c","36047a","36061a","36005a","36055c","36081a","37119c","37183c","39035c","39153c","39049c","39113c","39061c","40109c","40143c","41067c","41051a","42003c","42017c","42091c","42101a","42045c","42071c","44007c","47037a","47157c","48085c","48201c","48439c","48121c","48113c","48157c","48453c","48029c","48215c","48141a","49035c","49049c","51059c","53053c","53033a","53033b","53061c","55079a")
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

