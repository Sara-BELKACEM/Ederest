import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import init_db

class TestBackendEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_01_health_and_root(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("service", res.json())

        res_health = self.client.get("/health")
        self.assertEqual(res_health.status_code, 200)
        self.assertEqual(res_health.json()["status"], "healthy")

    def test_02_seed_endpoint(self):
        res = self.client.post("/seed?force=true")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertGreaterEqual(data["steps_loaded"], 4)
        self.assertGreaterEqual(data["sessions_loaded"], 40)
        self.assertGreaterEqual(data["events_loaded"], 100)
        self.assertGreaterEqual(data["responses_loaded"], 30)

    def test_03_record_and_get_event(self):
        new_event = {
            "session_id": "test-session-uuid-1234",
            "step_id": 1,
            "event_type": "step_entered",
            "details": "User entered step 1 via tab"
        }
        res = self.client.post("/events", json=new_event)
        self.assertEqual(res.status_code, 201)
        res_data = res.json()
        self.assertEqual(res_data["session_id"], "test-session-uuid-1234")
        self.assertEqual(res_data["event_type"], "step_entered")

        res_get = self.client.get("/events?session_id=test-session-uuid-1234")
        self.assertEqual(res_get.status_code, 200)
        self.assertGreaterEqual(len(res_get.json()), 1)

    def test_04_submit_response_with_pii_stripping(self):
        # Submission containing personal email and phone number
        response_payload = {
            "session_id": "test-session-uuid-9999",
            "step_id": 3,
            "trigger_type": "idle",
            "rating": 1,
            "comment": "Bloqué sur le vendeur ! Contactez learner.secret@school.edu ou +33 6 12 34 56 78 svp"
        }
        res = self.client.post("/responses", json=response_payload)
        self.assertEqual(res.status_code, 201)
        stored = res.json()
        
        # Verify privacy constraint: NO personal email or phone stored in DB
        self.assertNotIn("learner.secret@school.edu", stored["comment"])
        self.assertNotIn("+33 6 12 34 56 78", stored["comment"])
        self.assertIn("[email]", stored["comment"])
        self.assertIn("[phone]", stored["comment"])

    def test_05_get_insights_and_falsification_check(self):
        res = self.client.get("/insights")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Check top-level counters
        self.assertGreater(data["total_sessions"], 0)
        self.assertGreater(data["total_responses"], 0)
        self.assertGreater(data["total_events"], 0)
        self.assertIn("overall_completion_rate", data)

        # Check all 4 steps exist in metrics
        steps = data["step_metrics"]
        self.assertEqual(len(steps), 4)

        # Hypothesis test: Step 3 has highest drop_off_count
        step_3_metric = next(s for s in steps if s["step_number"] == 3)
        for s in steps:
            if s["step_number"] != 3:
                self.assertGreaterEqual(step_3_metric["drop_off_count"], s["drop_off_count"])

        # Check themes are present with traceability (step_ids and comment_count)
        themes = data["themes"]
        self.assertGreaterEqual(len(themes), 2)
        top_theme = themes[0]
        self.assertIn("label", top_theme)
        self.assertIn("summary", top_theme)
        self.assertIn("step_ids", top_theme)
        self.assertGreater(top_theme["comment_count"], 0)

        # Check trigger metrics
        self.assertGreater(len(data["trigger_metrics"]), 0)

    def test_06_refresh_themes(self):
        res = self.client.post("/insights/refresh")
        self.assertEqual(res.status_code, 200)
        themes = res.json()
        self.assertIsInstance(themes, list)
        self.assertGreaterEqual(len(themes), 2)

if __name__ == "__main__":
    unittest.main()
