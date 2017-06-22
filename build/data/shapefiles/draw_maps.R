library("maptools")
library("broom")
library("ggplot2")
library("tidyr")
library("dplyr")

colors <- c('#65a4e5','#a6d854','#0d73d6','#fc8d62','#66c2a5','#e5c494','#ffd92f');

supers <- data.frame(name=c("Young, less-educated, and diverse",
                            "Less-educated prime-age people",
                            "Diverse, less-educated, and eyeing retirement",
                            "Motivated and moderately educated younger people",
                            "Moderately educated older people",
                            "Highly educated and engaged younger people",
                            "Highly educated, high-income older people"),
                     superclus2=c(3,1,2,5,4,7,6),
                     colors=c('#0d73d6','#65a4e5','#a6d854','#66c2a5','#fc8d62','#ffd92f','#e5c494'),
                     order=1:7)

#place_input is fips, sp2 is spatial file
draw <- function(place_input, sp2){
  place <- as.character(place_input)
  g <- sp2[as.character(sp2@data$FIPS_final)==place & !is.na(sp2@data$FIPS_final),]
  
  fort <- tidy(g, region="GEOID10")
  fort2 <- merge(fort, g@data, by.x="id", by.y="GEOID10")
  
  l <- lapply(paste0("sc",1:7), function(sc){
    f2 <- fort2[,c("id","long","lat","order","hole","piece","group",sc)]
    names(f2)[length(f2)] <- "Share"
    f2$Supercluster <- as.numeric(sub("sc","",sc))
    return(f2)
  })
  
  df <- do.call(rbind, l)
  
  final <- merge(df, supers, by.x="Supercluster", by.y="superclus2")
  
  #fort3 <- fort2 %>% group_by(id,long,lat,order,hole,piece,group)  %>%  gather(supercluster, shsuper)
  
  for(s in 1:7){
    part <- final[final$Supercluster==s, ]
    plot(ggplot() + geom_polygon(data=part, aes(x=long, y=lat, group=id, fill=Share)) + 
        ggtitle(part[1,"name"]) +
        scale_fill_continuous(low="#ffffff", high=as.character(part[1,"colors"]), limits=c(0,NA)) ) 
  }

  return(final)
}

