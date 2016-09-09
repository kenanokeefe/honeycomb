class CellsController < ApplicationController
	respond_to :json

	def index		#shows all cells, HTTP GET
		cells = Cell.where(maker: params[:email])
		
		respond_with(cells) do |format|
			format.json { render :json => cells.as_json }
		end
	end


	def create		#creates a cell, HTTP POST
		require 'json'
		require 'multi_json'

		@new_cell = Cell.new
    	@new_cell.name =  params[:name]
		@new_cell.data = params[:data]
		@new_cell.opened = params[:opened]
		@new_cell.maker = params[:maker]
		@new_cell.save

		respond_with(@new_cell) do |format|
			format.json { render :json => @new_cell.as_json }
		end
	end


	def show		#opens the cell, HTTP GET
		#dont need right now b/c editor has cells array from BodyController in $scope.load_cells function, also in $scope.load_cell current_cell is defined based on the id in the $routeParam - so when a cell is clicked it simply changes the url and the current_cell updates accordingly b/c $scope.load_cell is called in the controllers found in the editor.html template
	end


	def update		#saves the cell, HTTP PATCH or PUT
		require 'json'

		cell = Cell.find(params[:id])
		#cell.name = params[:name]
		#cell.data = params[:data2]
		#cell.opened = params[:opened]
		#cell.save
		cell.update(name: params[:name], data: params[:dataString], opened: params[:opened])

		#respond_with(cell) do |format|
			#format.json { render :json => cell.as_json }
		#end

		#redirect_to makers_put_path #avoids 500 error on ajax call

	end


	def destroy		#deletes the cell, HTTP DELETE
		cell = Cell.find(params[:id])
		cell.destroy

		#redirect_to makers_delete_path #avoids 500 error on ajax call	end
	end

end
