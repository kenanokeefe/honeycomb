class Waitlist < ActiveRecord::Base
	validates :email, presence: true
	validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }
	validates :email, uniqueness: { case_sensitive: false }	
end
