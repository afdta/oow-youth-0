#!/usr/bin/env bash

folder=/home/alec/Projects/Brookings/out-of-work/build/data/shapefiles/subsetted

if [ -d "$folder/geojson" ]
then
	rm -r $folder/geojson
	mkdir $folder/geojson
	echo "$folder/geojson removed"
else
	mkdir $folder/geojson
	echo "no geojson folder to remove"
fi

if [ -d "$folder/topojson" ]
then
	rm -r $folder/topojson
	mkdir $folder/topojson
	echo "$folder/topojson removed"
else
	mkdir $folder/geojson
	echo "no topojson folder to remove"
fi

if [ -d "$folder/svg" ]
then
	rm -r $folder/svg
	mkdir $folder/svg
	echo "$folder/svg removed"
else
	mkdir $folder/geojson
	echo "no svg folder to remove"
fi



for var in 1073c 4013b 4013a 4019c 6037b 6019c 6037a 6001c 6013c 6029c 6071c 6085c 6099c 6073c 6059c 6065c 6075a 6077c 6067c 6081c 6111c 8031a 8041c 9001c 9003c 9009c 10003c 11001a 12011c 12009c 12031a 12057c 12071c 12086c 12095c 12099c 12103c 12105c 13089c 13121c 13135c 13067c 15003c 17089c 17197c 17043c 17097c 17031b 17031a 18097a 20091c 21111a 24005c 24510a 24031c 24033c 24003c 25025a 25005c 25027c 25009c 26125c 26081c 26099c 26163b 26163a 27123c 27053c 29095c 29189c 31055c 32003a 32003b 34023c 34031c 34017c 34003c 34025c 34007c 34013c 34039c 34029c 35001a 36029c 36119c 36059c 36103c 36047a 36061a 36005a 36055c 36081a 37119c 37183c 39035c 39153c 39049c 39113c 39061c 40109c 40143c 41067c 41051a 42003c 42017c 42091c 42101a 42045c 42071c 44007c 47037a 47157c 48085c 48201c 48439c 48121c 48113c 48157c 48453c 48029c 48215c 48141a 49035c 49049c 51059c 53053c 53033a 53033b 53061c 55079a

do 
#convert to geojson
shp2json $folder/esri/$var.shp -o $folder/geojson/$var.json

#convert to topojson
geo2topo pumas=$folder/geojson/$var.json > $folder/topojson/$var.json

#simplify
toposimplify -s 0.00000000175 -f < $folder/topojson/$var.json > $folder/topojson/${var}_simple.json

#quantize
topoquantize 1e5 $folder/topojson/${var}_simple.json > /home/alec/Projects/Brookings/out-of-work/data/maps/$var.json

#view output
#back to topojson
#topo2geo pumas=$folder/svg/$var.json < /home/alec/Projects/Brookings/out-of-work/data/maps/$var.json

#look at the final product
#geoproject 'd3.geoAlbersUsa().fitSize([1920, 1080], d)' < $folder/svg/$var.json > $folder/svg/${var}_albers.json

#geo2svg -w 1920 -h 1080 < $folder/svg/${var}_albers.json > $folder/svg/${var}_albers.svg

done