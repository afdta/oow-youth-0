library("jsonlite")
library("tidyr")
library("dplyr")
setwd("/home/alec/Projects/Brookings/out-of-work/build/data")

keep <- c("FIPS_final", "sample", 
          "count", "unemployed", "lastworked_pastyr", "male",  
          "a2534", "a3544", "a4554", "a5564", "whiteNH", 
          "blackNH", "latino", "asianNH", "otherNH", "insch", "lths", "hs", 
          "sc", "aa", "baplus", "dis", "fb", "lep", "married", "children", 
          "nospouse_kids", "snap", "fincpadj")

#"agemed", "age75", "age25", "Name_final"
#why doesn't topline equal sum of cluster data? see aggregate geos case for proof
supers <- data.frame(name=c("Young, less-educated, and diverse",
                            "Less-educated prime-age people",
                            "Diverse, less-educated, and eyeing retirement",
                            "Motivated and moderately educated younger people",
                            "Moderately educated older people",
                            "Highly educated and engaged younger people",
                            "Highly educated, high-income older people"),
                     superclus2=c(3,1,2,5,4,7,6),
                     order=1:7)
clus <- function(partial_name){
  return(supers[grep(partial_name, supers$name, ignore.case=TRUE), 1:2])
}

addsupers <- function(df){
  df2 <- merge(supers, df, by="superclus2")
  return(df2[order(df2$order), ])
}
           
boston<-all[grep("Boston", all$Name_final), 1:6]   
boston$shares <- boston$count/boston[boston$group=="ALL","count"]
asboston<-addsupers(boston)[c("superclus2","name","Name_final","group","count","shares")]

all <- read.csv("cluster, supercluster data.csv", stringsAsFactors = FALSE)
distro <- read.csv("supercluster distribution by geo.csv", stringsAsFactors = FALSE)
distribution <- read.csv("supercluster distribution by geo.csv", stringsAsFactors = FALSE) %>%
                gather(superclus, share, supercluster_pct1:supercluster_pct7) %>%
                separate(superclus, c("level","superclus2"), "_pct", convert=TRUE)

topline <- read.csv("topline descriptive statistics 25-64.csv", stringsAsFactors = FALSE)    #[c("POP",keep)]
toptest <- topline
toptest$nilf_total <- toptest$count*toptest$nilf
toptest$unemp_total <- toptest$count*toptest$unemployed
toptest[1:5, c(1:5, length(toptest), length(toptest)-1)]

sumsum <- function(d){
  return(data.frame(sum=sum(d$count, na.rm=TRUE), n=nrow(d)))
}

all %>% filter(group != 'ALL') %>% group_by(FIPS_final, Name_final) %>% do(sumsum(.))

#fix FIPS for aggregate geos
prev_fips <- all$FIPS_final
all$FIPS_final <- ifelse(all$Name_final=="AGGREGATE GEOS", "AGG", all$FIPS_final)
all[prev_fips != all$FIPS_final, 1:5]

prev_fips2 <- topline$FIPS_final
topline[topline$Name_final=="Whole US", "FIPS_final"] <- "US"
topline[topline$Name_final=="Aggregate sample geographies", "FIPS_final"] <- "AGG"
topline[prev_fips2 != topline$FIPS_final, 1:5] #left off here...

#pull off the total oow
oow <- topline[topline$POP=="Sample population", ]
universe <- topline[topline$POP=="Universe population", c("FIPS_final","count")]
names(universe)[2] <- "totpop"
oow_final <- merge(universe, oow[keep], by="FIPS_final")
oow_final$superclus2 <- "ALL"

oow_final$share <- oow_final$count/oow_final$totpop

#oow <- all[all$group=="ALL", keep]
#oow_us_agg <- 
#oow_us_agg$FIPS_final <- c("US", "AGG")
#oow_final <- rbind(oow_us_agg[keep], oow)
#oow_final$superclus2 <- "ALL"

super <- all[all$FIPS_final=="AGG", c("group", "superclus2", keep)]
jurisdiction <- all[all$group!="ALL", c("group", "superclus2", keep)]
lookup <- unique(all[c("FIPS_final", "Name_final")])

l <- list(super=super, jurisdiction=jurisdiction, oow=oow_final, lookup=lookup)

j <- toJSON(l, factor="string", na="null", digits=5)
jj <- c("var cluster_data = ", j, ";", "export default cluster_data;")

writeLines(jj, con = "../js/cluster_data.js")

##end

l <- list(overall=jurisdiction2, clusters=jurisdiction3)
j2 <- toJSON(l, factor="string", na="null", digits=5)
jj2 <- c("var jurisdiction_data = ", j2, ";", "export default jurisdiction_data;")
writeLines(jj2, con= "../js/jurisdiction_data.js")
