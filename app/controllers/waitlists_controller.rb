class WaitlistsController < ApplicationController
	respond_to :json

	def index		#shows all waitlists, HTTP GET
		waitlists = Waitlist.where(email: params[:email])
		
		respond_with(waitlists) do |format|
			format.json { render :json => waitlists.as_json }
		end
	end


	def create		#creates a waitlist, HTTP POST
		require 'json'
		require 'multi_json'

		@new_waitlist = Waitlist.new
    	@new_waitlist.email =  params[:email].downcase
		@new_waitlist.comment = params[:comment] || ""
		@new_waitlist.access = false;
		@new_waitlist.password = ([*('A'..'Z'),*('2'..'9')]-%w(0 1 I O)).sample(4).join
		@new_waitlist.admin = false;
		@new_waitlist.invited = false;
		@new_waitlist.logs = 0;
		@new_waitlist.save

		WaitlistMailer.waitlist_email(@new_waitlist).deliver
		WaitlistMailer.personal_log_email(@new_waitlist).deliver

		respond_with(@new_waitlist) do |format|
			format.json { render :json => @new_waitlist.as_json }
		end
	end


	def show		#opens the waitlist, HTTP GET
	end


	def update		#sends invites, HTTP PATCH or PUT
		@waitlisters = Waitlist.where(access: true, invited: false)

		if params[:send] === true
			@waitlisters.each do |i|	
				i.invited = true;
				i.save
				WaitlistMailer.invite_email(i).deliver
			end
		end

		respond_with(@waitlisters) do |format|
			format.json { render :json => @waitlisters.as_json }
		end
	end


	def destroy		#deletes the waitlist, HTTP DELETE
	end

end
