setwd("/home/alec/Projects/Brookings/out-of-work/build/data")
oow_profiles <- read.csv("cluster, supercluster data.csv")

super <- oow_profiles[1:7, ]

library("jsonlite")

j <- toJSON(super, factor="string", na="null", digits=5)

jj <- c("var supercluster_profile_data = ", j, ";", "export default supercluster_profile_data;")

writeLines(jj, con = "../js/supercluster_data.js")
