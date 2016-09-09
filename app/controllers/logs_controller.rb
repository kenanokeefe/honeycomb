class LogsController < ApplicationController
	respond_to :json

	def index		#shows all logs, HTTP GET
		logs = [] #Log.all
		
		respond_with(logs) do |format|
			format.json { render :json => logs.as_json }
		end
	end


	def create		#creates a log, HTTP POST
		require 'json'
		require 'multi_json'

		@new_log = Log.new
    	@new_log.maker =  params[:maker]
		@new_log.action = params[:action_name]
		@new_log.cell = params[:cell]
		@new_log.save

		@waitlisters = Waitlist.where(email: params[:maker])
		@waitlister = @waitlisters.first #.where returns an array
		@waitlister.logs += 1
		@waitlister.save

		@foo = []

		respond_with(@foo) do |format|
			format.json { render :json => @foo.as_json }
		end
	end


	def show		#opens the log, HTTP GET
	end


	def update		#saves the log, HTTP PATCH or PUT
	end


	def destroy		#deletes the log, HTTP DELETE
	end

end
