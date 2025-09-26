package com.xclone.xclone.domain.feedback;

import com.xclone.xclone.domain.like.NewLike;
import com.xclone.xclone.domain.post.PostDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/add-feedback")
    public ResponseEntity<?> addFeedback(@RequestBody Feedback newFeedback) {

        Feedback feedback = new Feedback();
        feedback.setUserId(newFeedback.getUserId());
        feedback.setType(newFeedback.getType());
        if (newFeedback.getUserId() != null) {
            feedback.setUserId(newFeedback.getUserId());
        }
        feedback.setText(newFeedback.getText());

        feedbackRepository.save(feedback);

        return ResponseEntity.ok("Feedback received");

    }
}
