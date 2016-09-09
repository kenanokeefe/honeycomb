class WaitlistMailer < ActionMailer::Base

	def waitlist_email(waitlister)
		mail(to: waitlister.email, from: '"Honeycomb" <XXXXXXXXXXX>', subject: 'Beta Waitlist Confirmation')
	end

	def personal_log_email(waitlister)
		@email = waitlister.email
		@comment = waitlister.comment
		mail(to: 'XXXXXXXXXXX', from: '"Honeycomb" <XXXXXXXXXXX>', subject: 'New Beta Signup')
	end

	def invite_email(waitlister)
		@password = waitlister.password
		mail(to: waitlister.email, from: '"Honeycomb" <XXXXXXXXXXX>', subject: 'Honeycomb Beta Access')
	end

end
