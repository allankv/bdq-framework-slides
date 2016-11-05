var ConceptualFramework = function() {
	this.contextulized = {};
	this.selected = {};
	this.available = {};
	this.profile = {};		
	this.nD = 0;
	this.nE = 0;
}
ConceptualFramework.prototype.setup = function(concept,selectorId,selectorIdDescription, addButton,itens) {							
	var self = this;
	self.selected[concept] = self.selected[concept]?self.selected[concept]:{};
	self.selected[concept].selectorId = selectorId;
	self.selected[concept].selectorIdDescription = selectorIdDescription;				
	$("#"+self.selected[concept].selectorId).change(function() {
		$("#"+selectorIdDescription).html('<strong>Definition</strong>: '+self.available[concept][$("#"+self.selected[concept].selectorId).val()].description);		
		if(!addButton){
			self.profile[concept] = self.available[concept][$("#"+self.selected[concept].selectorId).val()];
			self.updateProfileUseCase();
		}
	});
	if(addButton){
		$("#"+addButton).click(function() {
			self.profile[concept] = self.profile[concept]?self.profile[concept]:{};
			if(!self.profile[concept][$("#"+self.selected[concept].selectorId).val()]){							
				self.profile[concept][$("#"+self.selected[concept].selectorId).val()] = self.available[concept][$("#"+self.selected[concept].selectorId).val()];
				$("#"+itens).append('<span><small><strong>'+self.available[concept][$("#"+self.selected[concept].selectorId).val()].value+'</strong>: '+self.available[concept][$("#"+self.selected[concept].selectorId).val()].description+'</small></span><br>');
				self.updateContextualizedDimension();
				self.updateProfileVIE();
				Reveal.right();
				Reveal.left();
			}						
		});
	}			
}	
ConceptualFramework.prototype.updateProfileUseCase = function() {
	var self = this;	
	$("h2[name*='profile_title'").html('DQ Profile for <strong>'+self.profile.useCase.value+'</strong>');				
	$("div[name*='profile_use_case_definition'").html('<strong>'+self.profile.useCase.value+' Use Case</strong> - '+self.profile.useCase.description+'');				
}
ConceptualFramework.prototype.updateProfileVIE = function() {
	var self = this;								
	$('#vie_content').html('');
	Object.keys(self.profile.ie).forEach(function(key) {
		$('#vie_content').append('<div style="width:90%;"><strong>'+self.profile.ie[key].value+'</strong> - '+self.profile.ie[key].description+'</div>');				
	});								
}
ConceptualFramework.prototype.updateMeasurementPolicy = function() {
	var self = this;								
	$('#measurement_policy_content').html('');
	Object.keys(self.profile.measurement).forEach(function(key) {
		console.log("LOG: ",self.profile.measurement[key].name);
		$('#measurement_policy_content').append('<div style="width:90%;"><strong>'+self.profile.measurement[key].name+'</strong> - '+self.profile.measurement[key].definition+'</div>');				
	});								
}
ConceptualFramework.prototype.updateValidationPolicy = function() {
	var self = this;								
	$('#validation_policy_content').html('');
	Object.keys(self.profile.validation).forEach(function(key) {
		$('#validation_policy_content').append('<div style="width:90%;">'+self.profile.validation[key].criterion+'</div>');				
	});								
}
ConceptualFramework.prototype.updateImprovementPolicy = function() {
	var self = this;								
	$('#improvement_policy_content').html('');
	Object.keys(self.profile.improvement).forEach(function(key) {
		$('#improvement_policy_content').append('<div style="width:90%;">'+self.profile.improvement[key].definition+' <strong>('+self.profile.improvement[key].dimension.resourceType.value+' - '+self.profile.improvement[key].enhancementType.value+')</strong></div>');				
	});								
}
ConceptualFramework.prototype.updateContextualizedDimension = function() {
	var self = this;				
	var key = "dimension";
	if(Object.keys(self.profile.ie).length==1)
		$("#"+self.contextulized[key].selectorId).html('');
	Object.keys(self.profile.ie).forEach(function(keyIE) {					
		if($('#content_'+key+'_'+keyIE).length==0){			
			var content = $(`<section>
				<h3 style="color: #eee8d5;">3. Define a set of important `+self.contextulized[key].title+` for <strong>`+self.profile.ie[keyIE].value+`</strong></h3>
				<div id="content_`+key+`_`+keyIE+`"></div>
				<blockquote id="selected_dimension_`+key+`_`+keyIE+`_description">						
				</blockquote>
				<div id="`+key+`_`+keyIE+`_list">
				</div>
				</section>`);
			var dimensionsContent = $('<select style="vertical-align: middle;" id="available_'+key+'_'+keyIE+'"></select>');					
			Object.keys(self.available.dimension).forEach(function(id) {
				dimensionsContent.append('<option value="'+id+'">'+self.available.dimension[id].value+'</option>');	
			});					
			dimensionsContent.change(function() {
				if(dimensionsContent.val())												
					$('#selected_dimension_'+key+'_'+keyIE+'_description').html(self.available.dimension[dimensionsContent.val()].description);
				else
					$('#selected_dimension_'+key+'_'+keyIE+'_description').html('');
			});	
			dimensionsContent.append('<option value=""></option>');
			var resourceTypeContent = $('<select style="vertical-align: middle;" id="avaiable_resource_type_'+keyIE+'"></select>');
			Object.keys(self.available.resourceType).forEach(function(id) {
				resourceTypeContent.append('<option value="'+id+'">'+self.available.resourceType[id].value+'</option>');	
			});
			var define = $('<button>Define</button>');
			define.click(function() {
				self.profile.measurement = self.profile.measurement?self.profile.measurement:{};
				var dimensionId = $('#available_'+key+'_'+keyIE).val();
				var dimension = self.available.dimension[dimensionId].value;
				var ie = self.profile.ie[keyIE].value;
				var drId = $('#avaiable_resource_type_'+keyIE).val();							
				var dr = self.available.resourceType[drId].value;		
				var contextulizedId = keyIE+"-"+drId+"-"+dimensionId;

				if(!self.profile.measurement[contextulizedId]){							
					content.find("#"+key+"_"+keyIE+"_list").append('<span><small><strong>'+dimension+'</strong> of '+ie+' of '+dr+': <input id="definition_'+contextulizedId+'" type="text" placeholder="Definition"></input></small></span><br>');

					self.profile.measurement[contextulizedId] = self.profile.measurement[contextulizedId]?self.profile.measurement[contextulizedId]:{};
					self.profile.measurement[contextulizedId].dimension = self.available.dimension[dimensionId];
					self.profile.measurement[contextulizedId].ie = self.available.ie[keyIE];
					self.profile.measurement[contextulizedId].resourceType = self.available.resourceType[drId];
					self.profile.measurement[contextulizedId].definition = $('#definition_'+contextulizedId).val();
					self.profile.measurement[contextulizedId].name = dimension+' of '+ie+' of '+dr;

					content.find('#definition_'+contextulizedId).change(function() {															
						self.profile.measurement[contextulizedId].definition = $('#definition_'+contextulizedId).val();
						self.updateContextualizedCriterion();
						self.updateContextualizedEnhancement();
						self.updateMeasurementPolicy();
					});
					self.updateContextualizedCriterion();
					self.updateContextualizedEnhancement();
					self.updateMeasurementPolicy();
					Reveal.right();
					Reveal.left();
				}						
			});
			content.find("#content_"+key+"_"+keyIE).append(self.contextulized[key].title+': ').append(dimensionsContent).append("<br>").append("Resource Type: ").append(resourceTypeContent).append("<br>").append(define);					
			$("#"+self.contextulized[key].selectorId).append(content);	
		}										
	});					
}
ConceptualFramework.prototype.updateContextualizedCriterion = function() {
	var self = this;
	var key = "criterion";
	$("#"+self.contextulized[key].selectorId).html('');
	Object.keys(self.profile.ie).forEach(function(keyIE) {					
		var content = $(`<section>
			<h3 style="color: #eee8d5;">3. Define a set of important `+self.contextulized[key].title+` for <strong>`+self.profile.ie[keyIE].value+`</strong></h3>	
			<div id="content_`+key+`_`+keyIE+`"></div>			
			</section>`);					
		Object.keys(self.profile.measurement).forEach(function(id) {						
			if(self.profile.measurement[id].ie.id == keyIE){
				var idCriterion = 'criterion-'+id;
				content.find('#content_'+key+'_'+keyIE).append('<span id="'+id+'"><small>The measure for <strong>'+
					self.profile.measurement[id].dimension.value+' of '+
					self.profile.measurement[id].ie.value+' of '+
					self.profile.measurement[id].resourceType.value+'</strong> must be: <input id="'+idCriterion+'" type="text" placeholder="Acceptable value"></input></small></span><br>');	
				self.profile.validation = self.profile.validation?self.profile.validation:{};
				self.profile.validation[idCriterion] = self.profile.validation[id]?self.profile.validation[id]:{};
				self.profile.validation[idCriterion].id= idCriterion;
				self.profile.validation[idCriterion].criterion= 'The measure for <strong>'+self.profile.measurement[id].dimension.value+' of '+self.profile.measurement[id].ie.value+' of '+self.profile.measurement[id].resourceType.value+'</strong> must be <strong>?</strong>';
				content.find('#'+id).change(function() {
					self.profile.validation[idCriterion].criterion = 'The measure for <strong>'+self.profile.measurement[id].dimension.value+' of '+self.profile.measurement[id].ie.value+' of '+self.profile.measurement[id].resourceType.value+'</strong> must be <strong>'+content.find('#'+idCriterion).val()+'</strong>';
					self.updateValidationPolicy();
				});				
			}						
		});
		$("#"+self.contextulized[key].selectorId).append(content);		
		self.updateValidationPolicy();				
	});					
}
ConceptualFramework.prototype.setupContextualized = function(concept,selectorId,title) {									
	var self = this;
	self.contextulized[concept] = self.contextulized[concept]?self.contextulized[concept]:{};
	self.contextulized[concept].selectorId = selectorId;				
	self.contextulized[concept].title = title;				
}			
ConceptualFramework.prototype.addAvailableConcept = function(concept,id, value, description) {
	var	self = this;
	self.available[concept] = self.available[concept]?self.available[concept]:{};				
	self.available[concept][id] = {id:id, value:value,description:description};										
}			
ConceptualFramework.prototype.printAvailableConcept = function(concept) {
	var	self = this;
	Object.keys(self.available[concept]).forEach(function(key) {
		$("#"+self.selected[concept].selectorId).append('<option value="'+key+'">'+self.available[concept][key].value+'</option>');	
	});				
}	
ConceptualFramework.prototype.updateContextualizedEnhancement = function() {
	var self = this;				
	var key = "enhancement";
	if(Object.keys(self.profile.measurement).length==1) $("#"+self.contextulized[key].selectorId).html('');

	Object.keys(self.profile.measurement).forEach(function(keyDimension) {	
		var keyIE = self.profile.measurement[keyDimension].ie.id;				
		if($('#content_'+key+'_'+keyIE+'_'+keyDimension).length==0){							
			var content = $(`<section>
				<h3 style="color: #eee8d5;">3. Define a set of important `+self.contextulized[key].title+` to improve <strong>`+self.profile.measurement[keyDimension].dimension.value+`</strong> of <strong>`+self.profile.ie[keyIE].value+`</strong> of <strong>`+self.profile.measurement[keyDimension].resourceType.value+`</strong></h3>	
				<small>`+self.profile.measurement[keyDimension].definition+`</small>
				<div id="content_enhancement_`+keyIE+'_'+keyDimension+`"></div>				
				<blockquote id="`+key+`_`+keyIE+`_`+keyDimension+`_list">
				</blockquote>
				</section>`);
			content.find('#content_'+key+'_'+keyIE+'_'+keyDimension).append('DQ Enhancement: <input id="input_'+key+'_'+keyIE+'_'+keyDimension+'" type="text"></input>');
			var enhancementType = $('<select style="vertical-align: middle;" id="avaiable_enhancement_type_'+keyIE+'"></select>');
			Object.keys(self.available.enhancementType).forEach(function(id) {
				enhancementType.append('<option value="'+id+'">'+self.available.enhancementType[id].value+'</option>');	
			});
			var define = $('<button>Define</button>');
			define.click(function() {
				self.profile.improvement = self.profile.improvement?self.profile.improvement:{};
				var enhancementTypeId = $('#avaiable_enhancement_type_'+keyIE).val();
				var enhancementType = self.available.enhancementType[enhancementTypeId].value;				
				var enhancementDefinition = $('#input_'+key+'_'+keyIE+'_'+keyDimension).val();											
				var contextulizedId = enhancementTypeId+'-'+keyDimension+'-'+(self.nE++);
				if(!self.profile.improvement[contextulizedId]){							
					content.find('#'+key+'_'+keyIE+'_'+keyDimension+'_list').append(enhancementDefinition+' <strong>('+enhancementType+')</strong><br>');

					self.profile.improvement[contextulizedId] = self.profile.improvement[contextulizedId]?self.profile.improvement[contextulizedId]:{};
					self.profile.improvement[contextulizedId].dimension = self.profile.measurement[keyDimension];
					self.profile.improvement[contextulizedId].ie = self.available.ie[keyIE];
					self.profile.improvement[contextulizedId].enhancementType = self.available.enhancementType[enhancementTypeId];
					self.profile.improvement[contextulizedId].definition = enhancementDefinition;					
					self.updateImprovementPolicy();
					Reveal.right();
					Reveal.left();
				}						
			});
			content.find("#content_"+key+"_"+keyIE+'_'+keyDimension).append("<br>").append("Enhancement Type: ").append(enhancementType).append("<br>").append(define);					
			$("#"+self.contextulized[key].selectorId).append(content);	
		}
	});																	
}	