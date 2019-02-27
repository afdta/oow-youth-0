import dir from '../../../js-modules/rackspace.js';

	// Order and final names of major groups:
	// 1.“Young, less-educated, and diverse” (supercluster 3)
	// 2.“Less-educated prime-age people” (supercluster 1)
	// 3.“Diverse, less-educated, and eyeing retirement” (supercluster 2)
	// 4.“Motivated and moderately educated younger people” (supercluster 5)
	// 5.“Moderately educated older people” (supercluster 4)
	// 6.“Highly educated and engaged younger people” (supercluster 7)
	// 7.“Highly educated, high-income older people” (supercluster 6)

export default function avatars(container, supercluster){
	
	var data = {
		"1":[
				{name:"Joseph", about:["Joseph is a 51-year-old white man with a high school diploma. He last worked two years ago doing construction, and gave up looking for work about six months ago; construction has slowed down in his economically depressed area. He is single and lives with his brother and his family."]},
				{name:"Carmen", about:["Carmen is a 40-year-old married mother of teenage children. A green card holder, she immigrated to U.S. when she was very young, and never completed high school; she prefers to speak Spanish at home. She has been thinking about looking for work to help support the family, whose income is just above the poverty line."]}
			],
		"2":[
				{name:"Lola", about:["Lola is a 61-year-old Filipina immigrant; she is not a citizen but is in the United States legally. She never completed secondary school and does not speak much English. She used to work as a hotel housekeeper, but stopped nearly 10 years ago as her vision deteriorated."]},
				{name:"Valentina", about:[" Valentina is a 58-year-old married former home care aide. She is a U.S.-born Latina with a high school diploma. She stopped working five years ago to help care for her grandchildren, who do not live with her."]}
		],
		"3":[
				{name:"Patricia", about:["Patricia is a 25-year-old single mother who did not finish high school. She has never worked, instead caring for her young children and several nieces and nephews. Now that her children are school-age, she is looking for work outside the home. She is not a citizen and speaks Spanish at home."]},
				{name:"Will", about:["Will is a 30-year-old black man with a high school diploma who lost his warehouse packaging job nearly a year ago; he stopped looking for work several months ago. He is unmarried and recently moved back in with his mother."]}
		],
		"4":[
				{name:"Jacqueline", about:["Jacqueline is a 57-year-old white woman who left college to get married and start a family. Five years ago she left her job as a teacher's aide to care for her parents, who have since passed away. She is divorced, and has grown children; she lives alone."]},
				{name:"Bernadette", about:["Bernadette is a 52-year-old black woman with an Associate degree. She left her job as an office manager two years ago to recover from a serious car accident; she still has difficulty walking. She is now looking for similar work to help contribute to her and her husband's retirement."]}
		],
		"5":[
				{name:"Carlos", about:["Carlos is a 42-year-old second-generation American. He is single. He dropped out of college after his first year, and since then has mostly worked in retail and as a product promoter. He has not worked in the past 18 months while trying to get his business off the ground."]},
				{name:"Anna", about:["Anna is a 31-year-old single mother of a young daughter. She recently quit her home health aide job to find work with hours that will allow her to study to become a licensed practical nurse. Food stamps and public assistance are meager, but keep her afloat during this transition period."]}
		],
		"6":[
				{name:"Leonard", about:["Leonard is a 54-year-old white man who last worked three years ago as an accountant. He is not looking for work, as his wife's job can support them both, particularly given that they do not have children. He would like to work if the right opportunity came along."]},
				{name:"Moira", about:["Moira is a 57-year-old white woman with a Bachelor degree in speech pathology. She is married and has not worked in five years, unable to find a job where they moved for her husband's work. They do not have children."]}
		],
		"7":[
				{name:"Anika", about:["Anika is a 32-year-old who moved to the United States from India six years ago to pursue a Ph.D. She did not work while she was in school, but is now looking for a job doing pharmacology research. She met her husband in graduate school and was recently naturalized."]},
				{name:"Doug", about:["Doug is a 43-year-old information technology systems manager who was laid off in the past year. He will look for work soon, but is not in a hurry; his wife works, and he would like to as well."]}
		]
	}

	var meet = d3.select(container);
	var dat = data[supercluster+""];

		meet.append("p").text("Meet " + dat[0].name + " and " + dat[1].name)
					.style("padding","1em 0em 0em 0em")
					.style("margin","0em 0em 0.6em 10px")
					.style("font-weight","bold")
					.classed("font1x",true);

	var profiles = meet.selectAll("div").data(dat).enter().append("div").classed("avatar-profile c-fix",true)
						.style("margin-right",function(d,i){return i==0 ? "10%" : "0%"});

	var avatars = profiles.append("div").classed("avatar",true).append("img")
							.attr("src", function(d){return dir.url("avatars", d.name.toLowerCase() + ".png")} ) 
							.attr("alt", function(d){return d.name + " portrait"})
							;

		profiles.selectAll("p").data(function(d){return d.about}).enter().append("p").classed("avatar-text",true)
							  .text(function(d){return d});


}