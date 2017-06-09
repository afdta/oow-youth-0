library("jsonlite")
setwd("/home/alec/Projects/Brookings/out-of-work/build/data")

keep <- c("FIPS_final", "sample", 
          "count", "unemployed", "lastworked_pastyr", "male",  
          "a2534", "a3544", "a4554", "a5564", "whiteNH", 
          "blackNH", "latino", "asianNH", "otherNH", "insch", "lths", "hs", 
          "sc", "aa", "baplus", "dis", "fb", "lep", "married", "children", 
          "nospouse_kids", "snap", "fincpadj")

#"agemed", "age75", "age25", "Name_final"

all <- read.csv("cluster, supercluster data.csv")
distribution <- read.csv("supercluster distribution by geo.csv")
topline <- read.csv("topline descriptive statistics 25-64.csv")[c("POP",keep)]

super <- all[1:7, c("group", "superclus2", keep)]
jurisdiction <- all[, c("group", "superclus2", keep)]
lookup <- unique(all[c("FIPS_final", "Name_final")])

l <- list(super=super, jurisdiction=jurisdiction, lookup=lookup)

j <- toJSON(l, factor="string", na="null", digits=5)
jj <- c("var cluster_data = ", j, ";", "export default cluster_data;")

l <- list(overall=jurisdiction2, clusters=jurisdiction3)
j2 <- toJSON(l, factor="string", na="null", digits=5)
jj2 <- c("var jurisdiction_data = ", j2, ";", "export default jurisdiction_data;")

writeLines(jj, con = "../js/cluster_data.js")
writeLines(jj2, con= "../js/jurisdiction_data.js")
