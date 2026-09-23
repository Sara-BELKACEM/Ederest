import unittest
from app.services.privacy.stripper import strip_pii

class TestPrivacyStripper(unittest.TestCase):
    def test_strip_email(self):
        text = "Contact me at learner.test@company.org for help."
        cleaned = strip_pii(text)
        self.assertNotIn("learner.test@company.org", cleaned)
        self.assertIn("[email]", cleaned)

    def test_strip_multiple_emails(self):
        text = "Emails are user1@domain.com and user2@test.co.uk."
        cleaned = strip_pii(text)
        self.assertEqual(cleaned, "Emails are [email] and [email].")

    def test_strip_phone_number(self):
        sample_phones = [
            "Call me on +33 6 12 34 56 78 please",
            "Mon numéro est 0612345678",
            "Phone: +1 (555) 123-4567 urgently",
            "Reach out at +212 6 00 11 22 33",
        ]
        for phone_text in sample_phones:
            cleaned = strip_pii(phone_text)
            self.assertIn("[phone]", cleaned, f"Failed for {phone_text}")

    def test_preserves_task_codes(self):
        # Ensure purchase order codes or year/item numbers are not stripped
        text = "Purchase order PO-450001024 Material M-01 in 2024"
        cleaned = strip_pii(text)
        self.assertEqual(cleaned, text)

if __name__ == "__main__":
    unittest.main()
