class FeedbacksController < ApplicationController
	respond_to :json

	def index		#shows all feedbacks, HTTP GET
		feedbacks = [] #Feedback.all
		
		respond_with(feedbacks) do |format|
			format.json { render :json => feedbacks.as_json }
		end
	end


	def create		#creates a feedback, HTTP POST
		require 'json'
		require 'multi_json'

		@new_feedback = Feedback.new
    	@new_feedback.maker =  params[:maker]
		@new_feedback.text = params[:text]
		@new_feedback.save

		FeedbackMailer.feedback_email(@new_feedback).deliver

		respond_with(@new_feedback) do |format|
			format.json { render :json => @new_feedback.as_json }
		end
	end


	def show		#opens the feedback, HTTP GET
	end


	def update		#saves the feedback, HTTP PATCH or PUT
	end


	def destroy		#deletes the feedback, HTTP DELETE
	end

end
