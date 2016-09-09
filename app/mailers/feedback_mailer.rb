class FeedbackMailer < ActionMailer::Base

	def feedback_email(feedbacker)
		@email = feedbacker.maker
		@feedback = feedbacker.text
		mail(to: 'XXXXXXXXXXX', from: '"Honeycomb" <XXXXXXXXXXX>', subject: 'New Beta Feedback')
	end

end