package com.example.demotech.base.config;

import com.example.demotech.base.domain.Role;
import com.example.demotech.base.domain.User;
import com.example.demotech.base.helper.Enum;
import com.example.demotech.base.repository.RoleRepository;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.exercise.domain.Exercise;
import com.example.demotech.exercise.repository.ExerciseRepository;
import com.example.demotech.module.domain.Lesson;
import com.example.demotech.module.domain.LearningModule;
import com.example.demotech.module.domain.LessonContent;
import com.example.demotech.module.domain.Unit;
import com.example.demotech.module.repository.LearningModuleRepository;
import com.example.demotech.module.repository.LessonContentRepository;
import com.example.demotech.module.repository.LessonRepository;
import com.example.demotech.module.repository.UnitRepository;
import com.example.demotech.vocabulary.domain.FlashcardReview;
import com.example.demotech.vocabulary.domain.Vocabulary;
import com.example.demotech.vocabulary.repository.FlashcardReviewRepository;
import com.example.demotech.vocabulary.repository.VocabularyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(Enum.ROLE.ADMIN).isEmpty()) {
                roleRepository.save(new Role(Enum.ROLE.ADMIN, Enum.ROLE.ADMIN));
            }
            if (roleRepository.findByName(Enum.ROLE.USER).isEmpty()) {
                roleRepository.save(new Role(Enum.ROLE.USER, Enum.ROLE.USER));
            }
            System.out.println("✅ Roles initialized.");
        };
    }

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, RoleRepository roleRepository,
                                RedisTemplate<String, Object> redisTemplate) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (userRepository.findByUsername("admin").isEmpty()) {
                Role role = roleRepository.findByName(Enum.ROLE.ADMIN).orElse(new Role());
                User admin = new User("Đức Anh", "fostter2@gmail.com",
                        encoder.encode("123456"),
                        "admin", Set.of(role));
                userRepository.save(admin);
            }
            // Demo student account (password: Student@123)
            if (userRepository.findByUsername("student").isEmpty()) {
                Role role = roleRepository.findByName(Enum.ROLE.USER).orElse(new Role());
                User student = new User("Minh Anh", "student@englishpro.vn",
                        encoder.encode("123456"),
                        "student", Set.of(role));
                userRepository.save(student);
            }
            Set<String> keys = redisTemplate.keys("users*");
            if (keys != null && !keys.isEmpty()) redisTemplate.delete(keys);
            System.out.println("✅ Users initialized.");
        };
    }

    @Bean
    CommandLineRunner initModules(LearningModuleRepository moduleRepo,
                                  UnitRepository unitRepo,
                                  LessonRepository lessonRepo,
                                  LessonContentRepository contentRepo) {
        return args -> {
            if (moduleRepo.count() > 0) return;

            seedModule(moduleRepo, unitRepo, lessonRepo, contentRepo,
                    "exam_9to10", "Ôn thi 9 → 10",
                    "Tổng ôn toàn bộ ngữ pháp lớp 6–9, luyện đề thi tuyển sinh lớp 10 các tỉnh thành.",
                    "9,10", "#4361EE", 1,
                    new String[][]{
                            {"Unit 1: Ngữ pháp Nâng cao", "grammar"},
                            {"Unit 2: Kỹ năng Đọc hiểu", "reading"},
                            {"Unit 3: Kỹ năng Nghe", "listening"}
                    });

            seedModule(moduleRepo, unitRepo, lessonRepo, contentRepo,
                    "exam_university", "Ôn thi Đại học",
                    "Ngữ pháp THPT, đọc hiểu, sắp xếp câu, điền từ theo đề THPT Quốc gia.",
                    "12", "#7209B7", 2,
                    new String[][]{
                            {"Unit 1: Ngữ pháp Tổng hợp", "grammar"},
                            {"Unit 2: Luyện Đọc Theo Trình Độ", "reading"}
                    });

            seedModule(moduleRepo, unitRepo, lessonRepo, contentRepo,
                    "communication", "Giao tiếp A1 – B2",
                    "Từ vựng theo chủ đề, hội thoại mẫu, luyện nói role-play và mô tả tranh.",
                    "", "#06D6A0", 3,
                    new String[][]{
                            {"Unit 1: Giới thiệu bản thân", "vocabulary"},
                            {"Unit 2: Gia đình và Bạn bè", "vocabulary"}
                    });

            System.out.println("✅ Modules seeded.");
        };
    }

    private void seedModule(LearningModuleRepository moduleRepo, UnitRepository unitRepo,
                            LessonRepository lessonRepo, LessonContentRepository contentRepo,
                            String type, String title,
                            String description, String targetGrades, String color,
                            int sortOrder, String[][] unitDefs) {
        LearningModule m = new LearningModule();
        m.setType(type);
        m.setTitle(title);
        m.setDescription(description);
        m.setTargetGrades(targetGrades);
        m.setColor(color);
        m.setIsPublished(true);
        m.setSortOrder(sortOrder);
        moduleRepo.save(m);

        for (int i = 0; i < unitDefs.length; i++) {
            Unit unit = new Unit();
            unit.setModuleId(m.getId());
            unit.setTitle(unitDefs[i][0]);
            unit.setSortOrder(i + 1);
            unit.setUnlockThreshold(80);
            unitRepo.save(unit);
            seedLessons(lessonRepo, contentRepo, unit.getId(), unitDefs[i][1]);
        }
    }

    private void seedLessons(LessonRepository lessonRepo, LessonContentRepository contentRepo,
                             UUID unitId, String primaryType) {
        String[][] lessons;
        if ("grammar".equals(primaryType)) {
            lessons = new String[][]{
                    {"Thì hiện tại hoàn thành", "grammar"},
                    {"Câu điều kiện loại 1 & 2", "grammar"},
                    {"Mệnh đề quan hệ", "grammar"},
                    {"Bị động phức hợp", "grammar"},
            };
        } else if ("reading".equals(primaryType)) {
            lessons = new String[][]{
                    {"Đọc hiểu: Môi trường", "reading"},
                    {"Đọc hiểu: Khoa học & Công nghệ", "reading"},
                    {"Luyện đề đọc tổng hợp", "exam"},
            };
        } else if ("listening".equals(primaryType)) {
            lessons = new String[][]{
                    {"Nghe: Hội thoại đời thường", "listening"},
                    {"Nghe: Bài phát biểu", "listening"},
            };
        } else {
            lessons = new String[][]{
                    {"Từ vựng cơ bản", "vocabulary"},
                    {"Luyện nói theo chủ đề", "speaking"},
            };
        }

        for (int i = 0; i < lessons.length; i++) {
            Lesson lesson = new Lesson();
            lesson.setUnitId(unitId);
            lesson.setTitle(lessons[i][0]);
            lesson.setLessonType(lessons[i][1]);
            lesson.setDurationMinutes(15);
            lesson.setSortOrder(i + 1);
            lesson.setDifficulty(3);
            lessonRepo.save(lesson);

            String lessonContentType = lessons[i][1];
            if ("reading".equals(lessonContentType)) {
                LessonContent content = new LessonContent();
                content.setLessonId(lesson.getId());
                content.setContentType("reading");
                content.setContentJson(buildReadingContent(lesson.getTitle()));
                contentRepo.save(content);
            } else if ("listening".equals(lessonContentType)) {
                LessonContent content = new LessonContent();
                content.setLessonId(lesson.getId());
                content.setContentType("listening");
                content.setContentJson(buildListeningContent(lesson.getTitle()));
                contentRepo.save(content);
            }
        }
    }

    @Bean
    CommandLineRunner initExercises(ExerciseRepository exerciseRepo,
                                    LessonRepository lessonRepo,
                                    VocabularyRepository vocabRepo,
                                    FlashcardReviewRepository reviewRepo,
                                    UserRepository userRepo) {
        return args -> {
            if (exerciseRepo.count() > 0) return;

            List<Lesson> lessons = lessonRepo.findAll();
            for (Lesson lesson : lessons) {
                String type = lesson.getLessonType();
                boolean isGrammar = "grammar".equals(type);

                // MCQ 1
                Exercise mcq1 = new Exercise();
                mcq1.setLessonId(lesson.getId());
                mcq1.setExerciseType("multiple_choice");
                mcq1.setSortOrder(1);
                mcq1.setTotalPoints(10);
                mcq1.setQuestionJson("{\"text\":\"She ___ to school every day.\",\"options\":[{\"id\":\"a\",\"text\":\"go\"},{\"id\":\"b\",\"text\":\"goes\"},{\"id\":\"c\",\"text\":\"going\"}],\"allowMultiple\":false}");
                mcq1.setCorrectAnswerJson("{\"optionId\":\"b\"}");
                mcq1.setExplanation("Third person singular present simple uses 'goes'.");
                mcq1.setDifficulty(2);
                exerciseRepo.save(mcq1);

                // MCQ 2
                Exercise mcq2 = new Exercise();
                mcq2.setLessonId(lesson.getId());
                mcq2.setExerciseType("multiple_choice");
                mcq2.setSortOrder(2);
                mcq2.setTotalPoints(10);
                mcq2.setQuestionJson("{\"text\":\"They ___ watching TV right now.\",\"options\":[{\"id\":\"a\",\"text\":\"is\"},{\"id\":\"b\",\"text\":\"are\"},{\"id\":\"c\",\"text\":\"am\"}],\"allowMultiple\":false}");
                mcq2.setCorrectAnswerJson("{\"optionId\":\"b\"}");
                mcq2.setExplanation("'They' takes 'are' in present continuous.");
                mcq2.setDifficulty(2);
                exerciseRepo.save(mcq2);

                // MCQ 3
                Exercise mcq3 = new Exercise();
                mcq3.setLessonId(lesson.getId());
                mcq3.setExerciseType("multiple_choice");
                mcq3.setSortOrder(3);
                mcq3.setTotalPoints(10);
                mcq3.setQuestionJson("{\"text\":\"He ___ his homework yesterday.\",\"options\":[{\"id\":\"a\",\"text\":\"do\"},{\"id\":\"b\",\"text\":\"does\"},{\"id\":\"c\",\"text\":\"did\"}],\"allowMultiple\":false}");
                mcq3.setCorrectAnswerJson("{\"optionId\":\"c\"}");
                mcq3.setExplanation("Past simple uses 'did'.");
                mcq3.setDifficulty(3);
                exerciseRepo.save(mcq3);

                // Fill in the blank 1
                Exercise fib1 = new Exercise();
                fib1.setLessonId(lesson.getId());
                fib1.setExerciseType("fill_in_the_blank");
                fib1.setSortOrder(4);
                fib1.setTotalPoints(10);
                fib1.setQuestionJson("{\"text\":\"She ___ (go) to school every day.\",\"blanks\":1}");
                fib1.setCorrectAnswerJson("{\"answers\":[\"goes\"]}");
                fib1.setExplanation("Use third person singular present simple form.");
                fib1.setDifficulty(3);
                exerciseRepo.save(fib1);

                // Fill in the blank 2
                Exercise fib2 = new Exercise();
                fib2.setLessonId(lesson.getId());
                fib2.setExerciseType("fill_in_the_blank");
                fib2.setSortOrder(5);
                fib2.setTotalPoints(10);
                fib2.setQuestionJson("{\"text\":\"I ___ (study) English for 3 years.\",\"blanks\":1}");
                fib2.setCorrectAnswerJson("{\"answers\":[\"have studied\"]}");
                fib2.setExplanation("Use present perfect tense for an action continuing until now.");
                fib2.setDifficulty(4);
                exerciseRepo.save(fib2);
            }
            System.out.println("✅ Exercises seeded for " + lessons.size() + " lessons.");

            // Seed vocabulary for demo user
            if (vocabRepo.count() > 0) return;

            userRepo.findByUsername("student").ifPresent(student -> {
                String[][][] vocabPerLesson = {
                        {{"grammar", "ngữ pháp", "The grammar rules are complex.", null}},
                        {{"vocabulary", "từ vựng", "Build your vocabulary daily.", null}},
                        {{"fluent", "lưu loát", "She speaks English fluently.", null}},
                };
                int lessonIdx = 0;
                for (Lesson lesson : lessons) {
                    if (lessonIdx >= vocabPerLesson.length) break;
                    String[][] words = vocabPerLesson[lessonIdx++];
                    for (String[] w : words) {
                        String word = w[0];
                        String definition = w[1];
                        String example = w[2];
                        Vocabulary vocab = new Vocabulary();
                        vocab.setUserId(student.getId());
                        vocab.setWord(word);
                        vocab.setDefinition(definition);
                        vocab.setTranslation(definition);
                        vocab.setExample(example);
                        vocab.setSourceLessonId(lesson.getId());
                        vocabRepo.save(vocab);

                        FlashcardReview review = new FlashcardReview();
                        review.setUserId(student.getId());
                        review.setVocabularyId(vocab.getId());
                        review.setEaseFactor(2.5);
                        review.setIntervalDays(1);
                        review.setRepetitions(0);
                        review.setNextReviewAt(LocalDate.now());
                        reviewRepo.save(review);
                    }
                }
                System.out.println("✅ Vocabulary seeded for student.");
            });
        };
    }

    @Bean
    CommandLineRunner initLessonContent(LessonContentRepository contentRepo, LessonRepository lessonRepo) {
        return args -> {
            if (contentRepo.count() > 0) return;
            List<Lesson> lessons = lessonRepo.findAll();
            int count = 0;
            for (Lesson lesson : lessons) {
                String type = lesson.getLessonType();
                if ("reading".equals(type)) {
                    LessonContent content = new LessonContent();
                    content.setLessonId(lesson.getId());
                    content.setContentType("reading");
                    content.setContentJson(buildReadingContent(lesson.getTitle()));
                    contentRepo.save(content);
                    count++;
                } else if ("listening".equals(type)) {
                    LessonContent content = new LessonContent();
                    content.setLessonId(lesson.getId());
                    content.setContentType("listening");
                    content.setContentJson(buildListeningContent(lesson.getTitle()));
                    contentRepo.save(content);
                    count++;
                }
            }
            if (count > 0) System.out.println("✅ Lesson content seeded for " + count + " lessons.");
        };
    }

    private String buildReadingContent(String title) {
        return """
        {
          "paragraphs": [
            {
              "en": "The environment is the natural world around us. It includes all living things — plants, animals, and humans — as well as non-living elements like air, water, and soil. In recent decades, human activities have caused serious damage to the environment. Factories release harmful gases, vehicles produce exhaust fumes, and deforestation has reduced the amount of forest cover worldwide.",
              "vi": "Môi trường là thế giới tự nhiên xung quanh chúng ta. Nó bao gồm tất cả các sinh vật — thực vật, động vật và con người — cũng như các yếu tố không sống như không khí, nước và đất. Trong vài thập kỷ gần đây, các hoạt động của con người đã gây ra thiệt hại nghiêm trọng cho môi trường. Các nhà máy thải khí độc hại, phương tiện giao thông tạo ra khói thải, và nạn phá rừng đã làm giảm diện tích rừng trên toàn cầu."
            },
            {
              "en": "Climate change is one of the most pressing environmental issues today. Rising temperatures are causing polar ice caps to melt, which leads to rising sea levels. Many coastal cities around the world face the risk of flooding. Scientists warn that if we do not act now, the consequences could be catastrophic for future generations.",
              "vi": "Biến đổi khí hậu là một trong những vấn đề môi trường cấp bách nhất hiện nay. Nhiệt độ tăng cao đang khiến các chỏm băng ở vùng cực tan chảy, dẫn đến mực nước biển dâng. Nhiều thành phố ven biển trên thế giới đối mặt với nguy cơ ngập lụt. Các nhà khoa học cảnh báo rằng nếu chúng ta không hành động ngay bây giờ, hậu quả có thể là thảm khốc cho các thế hệ tương lai."
            },
            {
              "en": "However, there is hope. Renewable energy sources such as solar and wind power are becoming more affordable and widely used. Many governments are investing in green technology and encouraging people to reduce, reuse, and recycle. Individual actions, such as using public transport, saving electricity, and planting trees, can also make a significant difference.",
              "vi": "Tuy nhiên, vẫn còn hy vọng. Các nguồn năng lượng tái tạo như năng lượng mặt trời và gió đang trở nên rẻ hơn và được sử dụng rộng rãi hơn. Nhiều chính phủ đang đầu tư vào công nghệ xanh và khuyến khích mọi người giảm thiểu, tái sử dụng và tái chế. Các hành động cá nhân như sử dụng phương tiện công cộng, tiết kiệm điện và trồng cây cũng có thể tạo ra sự khác biệt đáng kể."
            }
          ],
          "vocabulary": [
            {"word": "environment", "definition": "môi trường", "example": "We must protect the environment.", "phonetic": "/ɪnˈvaɪrənmənt/"},
            {"word": "deforestation", "definition": "nạn phá rừng", "example": "Deforestation destroys habitats.", "phonetic": "/diːˌfɒrɪˈsteɪʃn/"},
            {"word": "catastrophic", "definition": "thảm khốc", "example": "The flood had catastrophic effects.", "phonetic": "/ˌkætəˈstrɒfɪk/"},
            {"word": "renewable", "definition": "tái tạo được", "example": "Solar is a renewable energy source.", "phonetic": "/rɪˈnjuːəbl/"},
            {"word": "consequences", "definition": "hậu quả", "example": "Actions have consequences.", "phonetic": "/ˈkɒnsɪkwənsɪz/"},
            {"word": "pressing", "definition": "cấp bách, quan trọng", "example": "This is a pressing issue.", "phonetic": "/ˈpresɪŋ/"},
            {"word": "exhaust", "definition": "khí thải", "example": "Car exhaust pollutes the air.", "phonetic": "/ɪɡˈzɔːst/"},
            {"word": "coastal", "definition": "ven biển", "example": "Coastal cities face flooding risk.", "phonetic": "/ˈkəʊstl/"}
          ],
          "questions": [
            {
              "id": "q1",
              "text": "What is the main cause of environmental damage mentioned in the first paragraph?",
              "options": ["A. Natural disasters", "B. Human activities", "C. Animal migration", "D. Volcanic eruptions"],
              "answer": "B",
              "explanation": "The text states 'human activities have caused serious damage to the environment'."
            },
            {
              "id": "q2",
              "text": "According to the passage, what happens when polar ice caps melt?",
              "options": ["A. Temperatures drop", "B. Forests grow back", "C. Sea levels rise", "D. Renewable energy increases"],
              "answer": "C",
              "explanation": "The text says 'Rising temperatures are causing polar ice caps to melt, which leads to rising sea levels'."
            },
            {
              "id": "q3",
              "text": "Which of the following is an individual action that can help the environment?",
              "options": ["A. Building more factories", "B. Using public transport", "C. Increasing deforestation", "D. Burning fossil fuels"],
              "answer": "B",
              "explanation": "The passage mentions 'using public transport' as an individual action that can make a difference."
            },
            {
              "id": "q4",
              "text": "What does the word 'pressing' mean in paragraph 2?",
              "options": ["A. Pushing down", "B. Printing", "C. Urgent / important", "D. Relaxing"],
              "answer": "C",
              "explanation": "'Pressing' here means urgent or requiring immediate attention."
            }
          ]
        }
        """;
    }

    private String buildListeningContent(String title) {
        return """
        {
          "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          "script": [
            {"id": "s1", "text": "Hello everyone, and welcome to today's English listening lesson.", "startTime": 0.0, "endTime": 4.5},
            {"id": "s2", "text": "My name is Sarah, and today we're going to practice listening to everyday conversations.", "startTime": 4.5, "endTime": 10.0},
            {"id": "s3", "text": "Let's start with a conversation between two friends at a coffee shop.", "startTime": 10.0, "endTime": 15.5},
            {"id": "s4", "text": "Tom: Hey Anna, it's great to see you! How have you been?", "startTime": 15.5, "endTime": 20.0},
            {"id": "s5", "text": "Anna: Hi Tom! I've been really busy lately. I just started a new job.", "startTime": 20.0, "endTime": 25.5},
            {"id": "s6", "text": "Tom: Oh wow, congratulations! What kind of work do you do?", "startTime": 25.5, "endTime": 30.0},
            {"id": "s7", "text": "Anna: I work as a software developer at a tech company downtown.", "startTime": 30.0, "endTime": 35.0},
            {"id": "s8", "text": "Tom: That sounds amazing! Do you enjoy it so far?", "startTime": 35.0, "endTime": 39.5},
            {"id": "s9", "text": "Anna: Yes, very much! The team is really friendly and the work is challenging but rewarding.", "startTime": 39.5, "endTime": 46.0},
            {"id": "s10", "text": "Tom: I'm so happy for you. We should catch up properly soon — maybe dinner next week?", "startTime": 46.0, "endTime": 52.0},
            {"id": "s11", "text": "Anna: Absolutely! That would be wonderful. I'll send you a message.", "startTime": 52.0, "endTime": 57.5},
            {"id": "s12", "text": "Great. Now let's listen to that conversation one more time and pay attention to the vocabulary.", "startTime": 57.5, "endTime": 64.0}
          ],
          "vocabulary": [
            {"word": "congratulations", "definition": "chúc mừng", "example": "Congratulations on your new job!"},
            {"word": "challenging", "definition": "thách thức, đòi hỏi nỗ lực", "example": "The work is challenging but rewarding."},
            {"word": "rewarding", "definition": "xứng đáng, mang lại nhiều ý nghĩa", "example": "Teaching is a rewarding career."},
            {"word": "catch up", "definition": "gặp lại, cập nhật tình hình", "example": "Let's catch up over coffee."},
            {"word": "downtown", "definition": "trung tâm thành phố", "example": "The office is located downtown."}
          ],
          "questions": [
            {
              "id": "q1",
              "text": "Where does the conversation take place?",
              "options": ["A. At the office", "B. At a coffee shop", "C. At a restaurant", "D. At home"],
              "answer": "B",
              "explanation": "The script says 'a conversation between two friends at a coffee shop'."
            },
            {
              "id": "q2",
              "text": "What is Anna's new job?",
              "options": ["A. Teacher", "B. Doctor", "C. Software developer", "D. Designer"],
              "answer": "C",
              "explanation": "Anna says 'I work as a software developer at a tech company downtown'."
            },
            {
              "id": "q3",
              "text": "How does Anna feel about her new job?",
              "options": ["A. Bored", "B. Stressed", "C. Unsure", "D. Happy and satisfied"],
              "answer": "D",
              "explanation": "Anna says 'Yes, very much! The team is friendly and the work is challenging but rewarding'."
            }
          ]
        }
        """;
    }
}
